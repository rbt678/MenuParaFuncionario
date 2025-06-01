
import { Comanda, ComandaSession, OrderItem, MenuItem, ComandaStatus, ALL_COMANDA_STATUSES } from '../types';
import { adicionalItems as allAdicionalItems, MENU_CATEGORIES } from '../data/menu';


const findMenuItemByNameAndPrice = (name: string, price: number, categoryHint?: string): Partial<MenuItem> => {
    // Try to find in existing menu items for more complete data
    const allItems = MENU_CATEGORIES.flatMap(cat => cat.items).concat(allAdicionalItems);
    const found = allItems.find(item => item.name.toUpperCase() === name.toUpperCase() && item.price === price);
    if (found) {
        return { ...found }; // Return a copy of the found item
    }
    // Fallback for items/addons not in current menu (e.g. old items)
    return {
        id: `imported_${name.replace(/\s+/g, '_')}_${price}`,
        name: name,
        price: price,
        category: categoryHint || 'IMPORTADO',
    };
};


const calculateLineItemTotal = (item: OrderItem): number => {
    const addonsTotal = item.selectedAddons?.reduce((sum, addonEntry) => {
        return sum + (addonEntry.addonItem.price * addonEntry.quantity);
    }, 0) || 0;
    return (item.price + addonsTotal) * item.quantity;
};

const formatPrice = (price: number): string => `R$${price.toFixed(2).replace('.', ',')}`;

const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};

export const exportComandasToText = (comandas: Comanda[]): string => {
  let text = "*** Relatório de Comandas - Restaurante ***\n";
  text += `Data da Exportação: ${formatDateTime(Date.now())}\n\n`;

  comandas.forEach(comanda => {
    text += `--- Comanda Nº ${comanda.comandaNumber || 'N/A'} ---\n`;
    text += `ID: ${comanda.id}\n`;
    if (comanda.customerName) {
      text += `Cliente: ${comanda.customerName}\n`;
    }
    text += `Criada em: ${formatDateTime(comanda.timestamp)}\n`;
    if (comanda.lastUpdatedTimestamp && comanda.lastUpdatedTimestamp !== comanda.timestamp) {
      text += `Última Atualização: ${formatDateTime(comanda.lastUpdatedTimestamp)}\n`;
    }
    text += `Status: ${comanda.status}\n`;
    text += `Total Geral: ${formatPrice(comanda.totalAmount)}\n\n`;
    text += `Sessões de Pedidos:\n`;

    comanda.sessions.forEach((session, index) => {
      text += `  -- Sessão ${index + 1} (Adicionada em: ${formatDateTime(session.timestamp)}) --\n`;
      text += `    Itens:\n`;
      session.items.forEach(item => {
        const itemBasePrice = item.price;
        const lineItemTotal = calculateLineItemTotal(item);
        text += `      - ${item.name} (Qtd: ${item.quantity}) | Unit: ${formatPrice(itemBasePrice)} | Line Total: ${formatPrice(lineItemTotal)}\n`;
        if (item.selectedAddons && item.selectedAddons.length > 0) {
          item.selectedAddons.forEach(addonEntry => {
            const addonItem = addonEntry.addonItem;
            const addonLineTotal = addonItem.price * addonEntry.quantity;
            text += `        + ${addonItem.name} (Qtd: ${addonEntry.quantity}) | Unit: ${formatPrice(addonItem.price)} | Addon Line Total: ${formatPrice(addonLineTotal)}\n`;
          });
        }
        if (item.observation) {
          text += `        Observação: ${item.observation}\n`;
        }
      });
      text += `\n`;
    });
    text += `--- Fim da Comanda Nº ${comanda.comandaNumber || 'N/A'} ---\n\n`;
  });

  text += "*** Fim do Relatório ***\n";
  return text;
};


// --- Import Logic ---

const parsePriceString = (priceStr: string): number | null => {
  const match = priceStr.match(/R\$([\d,.]+)/);
  if (!match || !match[1]) return null;
  try {
    return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
  } catch (e) {
    return null;
  }
};

const parseDateTimeString = (dateTimeStr: string): number | null => {
  const parts = dateTimeStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (!parts) return null;
  // parts[0] is full match, parts[1] is day, parts[2] is month, parts[3] is year, etc.
  const [, day, month, year, hour, minute] = parts;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  if (isNaN(parsedDate.getTime())) return null;
  return parsedDate.getTime();
};

const finalizeCurrentItem = (comanda: Partial<Comanda> & { currentSession?: Partial<ComandaSession> & { currentItem?: Partial<OrderItem> } }) => {
  if (comanda.currentSession?.currentItem?.name) {
    if (!comanda.currentSession.items) {
      comanda.currentSession.items = [];
    }
    (comanda.currentSession.items as OrderItem[]).push(comanda.currentSession.currentItem as OrderItem);
    comanda.currentSession.currentItem = {}; // Clear currentItem
  }
};

const finalizeCurrentSession = (comanda: Partial<Comanda> & { currentSession?: Partial<ComandaSession> & { currentItem?: Partial<OrderItem> } }) => {
  finalizeCurrentItem(comanda); // Ensure current item of this session is pushed
  if (comanda.currentSession?.items?.length) { // Only push session if it has items
    if (!comanda.sessions) {
      comanda.sessions = [];
    }
    (comanda.sessions as ComandaSession[]).push(comanda.currentSession as ComandaSession);
  }
  // comanda.currentSession = undefined; // Clear currentSession structure, will be rebuilt by next session line
};


export const importComandasFromText = (text: string): { newComandas: Comanda[], errors: string[] } => {
  const lines = text.split('\n');
  const newComandas: Comanda[] = [];
  const errors: string[] = [];
  let currentComanda: Partial<Comanda> & { currentSession?: Partial<ComandaSession> & { currentItem?: Partial<OrderItem> } } = {};
  let inComandaBlock = false;
  let inSessionBlock = false; 

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("--- Comanda Nº")) {
      if (inComandaBlock && currentComanda.id) { 
        errors.push(`Linha ${lineNumber}: Nova comanda iniciada sem finalizar a anterior. Tentando salvar a anterior.`);
        finalizeCurrentSession(currentComanda); 
        if (currentComanda.id && currentComanda.sessions && currentComanda.sessions.length > 0 && currentComanda.status && currentComanda.timestamp) {
            let calculatedTotal = 0;
            currentComanda.sessions.forEach(s => s.items.forEach(i => calculatedTotal += calculateLineItemTotal(i)));
            currentComanda.totalAmount = calculatedTotal;
            newComandas.push(currentComanda as Comanda);
        } else {
            errors.push(`Linha ${lineNumber}: Bloco de comanda anterior (antes de nova) incompleto, não salvo.`);
        }
      }
      currentComanda = {};
      inComandaBlock = true;
      inSessionBlock = false; 
      const comandaNumMatch = trimmedLine.match(/--- Comanda Nº (\d+|N\/A) ---/);
      if (comandaNumMatch && comandaNumMatch[1] !== 'N/A') {
        currentComanda.comandaNumber = parseInt(comandaNumMatch[1], 10);
      }
      return;
    }

    if (trimmedLine.startsWith("--- Fim da Comanda Nº") && inComandaBlock) {
      finalizeCurrentSession(currentComanda); 

      if (currentComanda.id && currentComanda.sessions && currentComanda.sessions.length > 0 && currentComanda.status && currentComanda.timestamp) {
        let calculatedTotal = 0;
        currentComanda.sessions.forEach(s => s.items.forEach(i => calculatedTotal += calculateLineItemTotal(i)));
        currentComanda.totalAmount = calculatedTotal;
        newComandas.push(currentComanda as Comanda);
      } else {
        errors.push(`Linha ${lineNumber}: Bloco de comanda finalizado, mas dados incompletos: ${JSON.stringify({
            id: currentComanda.id, 
            sessionsCount: currentComanda.sessions?.length, 
            status: currentComanda.status, 
            timestamp: currentComanda.timestamp
        })}`);
      }
      currentComanda = {};
      inComandaBlock = false;
      inSessionBlock = false;
      return;
    }

    if (!inComandaBlock) return; 

    if (trimmedLine.startsWith("ID:")) {
      currentComanda.id = trimmedLine.substring(4).trim();
    } else if (trimmedLine.startsWith("Cliente:")) {
      currentComanda.customerName = trimmedLine.substring(9).trim();
    } else if (trimmedLine.startsWith("Criada em:")) {
      currentComanda.timestamp = parseDateTimeString(trimmedLine.substring(10).trim());
      if(currentComanda.timestamp === null) errors.push(`Linha ${lineNumber}: Formato de data inválido para "Criada em".`);
      if(!currentComanda.lastUpdatedTimestamp) currentComanda.lastUpdatedTimestamp = currentComanda.timestamp;
    } else if (trimmedLine.startsWith("Última Atualização:")) {
      currentComanda.lastUpdatedTimestamp = parseDateTimeString(trimmedLine.substring(19).trim());
       if(currentComanda.lastUpdatedTimestamp === null) errors.push(`Linha ${lineNumber}: Formato de data inválido para "Última Atualização".`);
    } else if (trimmedLine.startsWith("Status:")) {
      const statusStr = trimmedLine.substring(8).trim() as ComandaStatus;
      if (ALL_COMANDA_STATUSES.includes(statusStr)) {
        currentComanda.status = statusStr;
      } else {
         errors.push(`Linha ${lineNumber}: Status "${statusStr}" inválido.`);
         currentComanda.status = 'Pendente'; 
      }
    } else if (trimmedLine.startsWith("Total Geral:")) {
        const parsedTotal = parsePriceString(trimmedLine.substring(12).trim());
        if (parsedTotal === null) errors.push(`Linha ${lineNumber}: Formato de preço inválido para "Total Geral".`);
    } else if (trimmedLine.startsWith("Sessões de Pedidos:")) {
      currentComanda.sessions = []; 
    } else if (trimmedLine.startsWith("-- Sessão")) {
      if (inSessionBlock) { 
        finalizeCurrentSession(currentComanda); 
      }
      
      inSessionBlock = true;
      const sessionTimestampMatch = trimmedLine.match(/\(Adicionada em: (.*?)\) --/);
      const sessionTimestamp = sessionTimestampMatch ? parseDateTimeString(sessionTimestampMatch[1]) : null;
      if (sessionTimestamp === null) errors.push(`Linha ${lineNumber}: Formato de data inválido para sessão.`);
      currentComanda.currentSession = { timestamp: sessionTimestamp || Date.now(), items: [] , currentItem: {} };
    } else if (trimmedLine.startsWith("Itens:") && inSessionBlock) {
      if (currentComanda.currentSession && !currentComanda.currentSession.items) {
          currentComanda.currentSession.items = [];
      }
    } else if (trimmedLine.startsWith("- ") && inSessionBlock) { 
      finalizeCurrentItem(currentComanda); 
      
      currentComanda.currentSession!.currentItem = { selectedAddons: [] }; 

      const itemMatch = trimmedLine.match(/- (.*?) \(Qtd: (\d+)\) \| Unit: (R\$[\d,.]+) \| Line Total: (R\$[\d,.]+)/);
      if (itemMatch) {
        const [, name, qtyStr, unitPriceStr] = itemMatch; 
        const unitPrice = parsePriceString(unitPriceStr);

        if (unitPrice === null) {
            errors.push(`Linha ${lineNumber}: Formato de preço unitário inválido para item "${name}".`);
        } else {
            const baseItem = findMenuItemByNameAndPrice(name, unitPrice, 'IMPORTADO_ITEM') as MenuItem;
            currentComanda.currentSession!.currentItem = {
                ...baseItem,
                id: `${baseItem.id || 'item'}_${Date.now()}_${Math.random().toString(16).slice(2)}`, 
                quantity: parseInt(qtyStr, 10),
                selectedAddons: [],
                observation: undefined, // Initialize observation
            };
        }
      } else {
        errors.push(`Linha ${lineNumber}: Formato de item inválido: "${trimmedLine}"`);
        currentComanda.currentSession!.currentItem = {}; 
      }
    } else if (trimmedLine.startsWith("+ ") && currentComanda.currentSession?.currentItem?.name && inSessionBlock) { 
      const addonMatch = trimmedLine.match(/\+ (.*?) \(Qtd: (\d+)\) \| Unit: (R\$[\d,.]+) \| Addon Line Total: (R\$[\d,.]+)/);
      if (addonMatch) {
        const [, name, qtyStr, unitPriceStr] = addonMatch; 
        const unitPrice = parsePriceString(unitPriceStr);

        if (unitPrice === null) {
           errors.push(`Linha ${lineNumber}: Formato de preço unitário inválido para adicional "${name}".`);
        } else {
            const addonMenuItem = findMenuItemByNameAndPrice(name, unitPrice, 'ADICIONAIS') as MenuItem;
             if (!currentComanda.currentSession!.currentItem!.selectedAddons) {
                currentComanda.currentSession!.currentItem!.selectedAddons = [];
            }
            currentComanda.currentSession!.currentItem!.selectedAddons!.push({
                addonItem: {
                    ...addonMenuItem,
                    id: `${addonMenuItem.id || 'addon'}_${Date.now()}_${Math.random().toString(16).slice(3)}`, 
                },
                quantity: parseInt(qtyStr, 10),
            });
        }
      } else {
        errors.push(`Linha ${lineNumber}: Formato de adicional inválido: "${trimmedLine}"`);
      }
    } else if (trimmedLine.startsWith("Observação:") && currentComanda.currentSession?.currentItem?.name && inSessionBlock) {
        const observationText = trimmedLine.substring(12).trim();
        if (currentComanda.currentSession.currentItem) {
            currentComanda.currentSession.currentItem.observation = observationText;
        }
    }
  });
  
  if (inComandaBlock && currentComanda.id) { 
    errors.push(`Fim do arquivo: Comanda não finalizada por tag "--- Fim da Comanda ---". Tentando salvar.`);
    finalizeCurrentSession(currentComanda); 
    
    if (currentComanda.id && currentComanda.sessions && currentComanda.sessions.length > 0 && currentComanda.status && currentComanda.timestamp) {
        let calculatedTotal = 0;
        currentComanda.sessions.forEach(s => s.items.forEach(i => calculatedTotal += calculateLineItemTotal(i)));
        currentComanda.totalAmount = calculatedTotal;
        newComandas.push(currentComanda as Comanda);
    } else {
         errors.push(`Fim do arquivo: Bloco de comanda (EOF) incompleto, não salvo: ${JSON.stringify({
            id: currentComanda.id, 
            sessionsCount: currentComanda.sessions?.length, 
            status: currentComanda.status, 
            timestamp: currentComanda.timestamp
        })}`);
    }
  }

  return { newComandas, errors };
};
