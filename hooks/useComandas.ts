
import { useState, useEffect, useRef, useCallback } from 'react';
import { Comanda, ComandaStatus, ComandaSession, OrderItem, ShowToastFn, SetModalConfig, SetSelectedComandaState, SetComandasState } from '../types';
import { TEXTS } from '../constants/texts';

// Helper function to calculate total for a single OrderItem (including its addons)
const calculateOrderItemTotal = (orderItem: OrderItem): number => {
  const addonsTotal = orderItem.selectedAddons?.reduce((sum, addonEntry) => {
    return sum + (addonEntry.addonItem.price * addonEntry.quantity);
  }, 0) || 0;
  return (orderItem.price + addonsTotal) * orderItem.quantity;
};

// Helper function to calculate total for a list of OrderItems
const calculateTotalForItemsList = (itemsList: OrderItem[]): number => {
  return itemsList.reduce((sum, item) => sum + calculateOrderItemTotal(item), 0);
};

// Helper function to calculate the grand total for a Comanda (summing all sessions)
const calculateComandaGrandTotal = (sessions: ComandaSession[]): number => {
  return sessions.reduce((sum, session) => sum + calculateTotalForItemsList(session.items), 0);
};


interface UseComandasParams {
  showToast: ShowToastFn;
  setModalConfig: SetModalConfig; 
  setSelectedComandaForApp: SetSelectedComandaState; 
  setAddingToComandaIdStateInApp?: (id: string | null) => void; 
  setActiveViewInApp?: (view: 'menu' | 'manageComandas') => void;
}

interface UseComandasReturn {
  comandas: Comanda[];
  setComandas: SetComandasState; 
  selectedComanda: Comanda | null;
  setSelectedComanda: SetSelectedComandaState;
  finalizeNewComanda: (currentOrderItems: OrderItem[], customerName?: string) => void;
  updateComandaStatus: (comandaId: string, newStatus: ComandaStatus) => void;
  addItemsToExistingComanda: (comandaId: string, itemsToAdd: OrderItem[]) => void;
  deleteComanda: (comandaId: string) => void;
  importComandas: (importedComandas: Comanda[]) => { successCount: number; duplicateCount: number };
  handleSelectComanda: (comanda: Comanda) => void;
  handleClearSelectedComanda: () => void;
  comandaCounterRef: React.MutableRefObject<number>;
}

const useComandas = ({ 
  showToast, 
  // setModalConfig, // Not directly used in this hook for now, but kept for potential future use
  setSelectedComandaForApp,
}: UseComandasParams): UseComandasReturn => {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null);
  const comandaCounterRef = useRef(0);

  useEffect(() => {
    try {
      const storedComandas = localStorage.getItem('Comandas');
      if (storedComandas) {
        let parsedComandas = JSON.parse(storedComandas) as Array<Comanda | any>;
        if (Array.isArray(parsedComandas)) {
          const migratedComandas = parsedComandas.map(comanda => {
            if (comanda.items && !comanda.sessions) { 
              const newSessions: ComandaSession[] = [{
                timestamp: comanda.timestamp,
                items: comanda.items as OrderItem[]
              }];
              return {
                ...comanda,
                sessions: newSessions,
                totalAmount: calculateComandaGrandTotal(newSessions),
                items: undefined 
              } as Comanda;
            }
            if (!comanda.sessions || !Array.isArray(comanda.sessions)) {
                console.warn("Invalid comanda structure found in localStorage, attempting to fix or discard:", comanda);
                if (comanda.items && Array.isArray(comanda.items)) { 
                     const newSessions: ComandaSession[] = [{ timestamp: comanda.timestamp || Date.now(), items: comanda.items as OrderItem[] }];
                     return { ...comanda, sessions: newSessions, totalAmount: calculateComandaGrandTotal(newSessions), items: undefined } as Comanda;
                }
                return null; 
            }
            const expectedTotal = calculateComandaGrandTotal(comanda.sessions);
            if (comanda.totalAmount !== expectedTotal) {
                comanda.totalAmount = expectedTotal;
            }
            return comanda as Comanda;
          }).filter(c => c && c.sessions && Array.isArray(c.sessions)) as Comanda[]; 

          setComandas(migratedComandas);
          if (migratedComandas.length > 0) {
            comandaCounterRef.current = Math.max(...migratedComandas.map(c => c.comandaNumber || 0), 0);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar comandas do localStorage:", error);
      showToast(TEXTS.TOAST_ERROR_LOADING_COMANDAS_HISTORY, "error");
    }
  }, [showToast]); 

  useEffect(() => {
    localStorage.setItem('Comandas', JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    setSelectedComandaForApp(selectedComanda);
  }, [selectedComanda, setSelectedComandaForApp]);


  const finalizeNewComanda = useCallback((currentOrderItems: OrderItem[], customerName?: string) => {
    if (currentOrderItems.length === 0) {
        showToast(TEXTS.TOAST_FINALIZE_ADD_ITEMS_FIRST, "error");
        return;
    }
    comandaCounterRef.current += 1;
    const now = Date.now();
    const firstSession: ComandaSession = {
      timestamp: now,
      items: [...currentOrderItems] 
    };
    
    const newComanda: Comanda = {
      id: now.toString() + '-' + Math.random().toString(36).substring(2, 11),
      comandaNumber: comandaCounterRef.current,
      timestamp: now,
      lastUpdatedTimestamp: now,
      sessions: [firstSession], 
      totalAmount: calculateTotalForItemsList(firstSession.items),
      status: 'Pendente',
      customerName: customerName?.trim() || undefined,
    };

    setComandas(prevComandas => [newComanda, ...prevComandas].sort((a,b) => (b.comandaNumber || 0) - (a.comandaNumber || 0)));
    const customerPart = customerName ? `${TEXTS.TOAST_NEW_COMANDA_FINALIZED_CUSTOMER_PREFIX}${customerName}` : '';
    showToast(`${TEXTS.TOAST_NEW_COMANDA_FINALIZED_NUMBER_PREFIX}${newComanda.comandaNumber}${customerPart}${TEXTS.TOAST_NEW_COMANDA_FINALIZED_SUFFIX}`, 'success');
  }, [showToast]);

  const updateComandaStatus = useCallback((comandaId: string, newStatus: ComandaStatus) => {
    const now = Date.now();
    let comandaNumberForToast: number | string = TEXTS.TOAST_COMANDA_STATUS_UPDATED_UNKNOWN_ID;
    setComandas(prevComandas =>
      prevComandas.map(c => {
        if (c.id === comandaId) {
          comandaNumberForToast = c.comandaNumber || c.id.substring(0,6);
          return { ...c, status: newStatus, lastUpdatedTimestamp: now };
        }
        return c;
      })
    );
    setSelectedComanda(prev => {
        if (prev && prev.id === comandaId) {
            return { ...prev, status: newStatus, lastUpdatedTimestamp: now };
        }
        return prev;
    });
    showToast(`${TEXTS.TOAST_COMANDA_STATUS_UPDATED_NUMBER_PREFIX}${comandaNumberForToast}${TEXTS.TOAST_COMANDA_STATUS_UPDATED_STATUS_SUFFIX}${newStatus}.`, 'success');
  }, [showToast]);

  const addItemsToExistingComanda = useCallback((comandaId: string, itemsToAdd: OrderItem[]) => {
      if (itemsToAdd.length === 0) {
          showToast(TEXTS.TOAST_NO_ITEMS_TO_ADD, "info");
          return;
      }
      let comandaNumberForToast: number | string = TEXTS.TOAST_ITEMS_ADDED_TO_COMANDA_UNKNOWN_ID;
      setComandas(prevComandas => 
        prevComandas.map(comanda => {
          if (comanda.id === comandaId) {
            comandaNumberForToast = comanda.comandaNumber || comanda.id.substring(0,6);
            const newSession: ComandaSession = {
              timestamp: Date.now(),
              items: [...itemsToAdd] 
            };
            const updatedSessions = [...comanda.sessions, newSession];
            const updatedComanda = {
              ...comanda,
              sessions: updatedSessions,
              totalAmount: calculateComandaGrandTotal(updatedSessions),
              lastUpdatedTimestamp: newSession.timestamp
            };
            setSelectedComanda(prevSel => prevSel && prevSel.id === comandaId ? updatedComanda : prevSel);
            return updatedComanda;
          }
          return comanda;
        })
      );
      showToast(`${TEXTS.TOAST_ITEMS_ADDED_TO_COMANDA_NUMBER_PREFIX}${comandaNumberForToast}${TEXTS.TOAST_ITEMS_ADDED_TO_COMANDA_SUFFIX}`, 'success');
  }, [showToast]);

  const deleteComanda = useCallback((comandaId: string) => {
    setComandas(prevComandas => prevComandas.filter(c => c.id !== comandaId));
  }, []);

  const importComandas = useCallback((importedComandasToMerge: Comanda[]): { successCount: number; duplicateCount: number } => {
    let successCount = 0;
    let duplicateCount = 0;
    
    setComandas(prevComandas => {
      const existingComandaIds = new Set(prevComandas.map(c => c.id));
      const comandasToAdd: Comanda[] = [];
      
      importedComandasToMerge.forEach(importedCmd => {
        if (!existingComandaIds.has(importedCmd.id)) {
          comandasToAdd.push(importedCmd);
          existingComandaIds.add(importedCmd.id); 
          successCount++;
        } else {
          duplicateCount++;
        }
      });

      if (comandasToAdd.length > 0) {
        const updatedComandas = [...prevComandas, ...comandasToAdd].sort((a,b) => (b.comandaNumber || 0) - (a.comandaNumber || 0));
        comandaCounterRef.current = Math.max(comandaCounterRef.current, ...updatedComandas.map(c => c.comandaNumber || 0), 0);
        return updatedComandas;
      }
      return prevComandas; 
    });

    return { successCount, duplicateCount };
  }, []);


  const handleSelectComanda = useCallback((comanda: Comanda) => {
    setSelectedComanda(comanda);
  }, []);

  const handleClearSelectedComanda = useCallback(() => {
    setSelectedComanda(null);
  }, []);


  return { 
    comandas, 
    setComandas,
    selectedComanda, 
    setSelectedComanda,
    finalizeNewComanda, 
    updateComandaStatus,
    addItemsToExistingComanda,
    deleteComanda,
    importComandas,
    handleSelectComanda,
    handleClearSelectedComanda,
    comandaCounterRef
  };
};

export default useComandas;
