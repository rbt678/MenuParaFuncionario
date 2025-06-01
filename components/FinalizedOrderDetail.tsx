
import React from 'react';
import { Comanda, OrderItem, ComandaStatus, ALL_COMANDA_STATUSES, MenuItem, ComandaSession } from '../types';

interface ComandaDetailProps {
  comanda: Comanda;
  onBack: () => void;
  onUpdateStatus: (comandaId: string, newStatus: ComandaStatus) => void;
  onOpenAddItemsToExistingComanda: (comandaId: string) => void; // Added prop
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; valueClass?: string; fullWidth?: boolean; isTime?: boolean }> = 
    ({ label, value, valueClass = "text-gray-100", fullWidth = false, isTime = false }) => (
  <div className={`mb-2 ${fullWidth ? 'md:col-span-2' : ''} ${isTime ? 'text-xs' : ''}`}>
    <span className="font-semibold text-amber-400">{label}: </span>
    <span className={valueClass}>{value}</span>
  </div>
);

const StatusBadgeDetail: React.FC<{ status: string }> = ({ status }) => {
  let bgColor = 'bg-gray-500';
  let textColor = 'text-white';

  switch (status) {
    case 'Pendente':
      bgColor = 'bg-yellow-500';
      textColor = 'text-yellow-900';
      break;
    case 'Em Preparo':
      bgColor = 'bg-blue-500';
      textColor = 'text-blue-100';
      break;
    case 'Pronto para Retirada':
      bgColor = 'bg-green-500';
      textColor = 'text-green-100';
      break;
    case 'Concluído':
      bgColor = 'bg-emerald-600';
      textColor = 'text-emerald-100';
      break;
    case 'Cancelado':
      bgColor = 'bg-red-500';
      textColor = 'text-red-100';
      break;
  }
  return (
    <span className={`px-3 py-1 text-sm font-bold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

// Helper function to calculate total for a single OrderItem (including its addons)
const calculateLineItemTotal = (item: OrderItem): number => {
    const addonsTotal = item.selectedAddons?.reduce((sum, addonEntry) => {
        return sum + (addonEntry.addonItem.price * addonEntry.quantity);
    }, 0) || 0;
    return (item.price + addonsTotal) * item.quantity;
};


const ComandaDetail: React.FC<ComandaDetailProps> = ({ comanda, onBack, onUpdateStatus, onOpenAddItemsToExistingComanda }) => {
  const comandaCreationDate = new Date(comanda.timestamp); // Timestamp of first session
  const formattedCreationDate = `${comandaCreationDate.toLocaleDateString('pt-BR')} às ${comandaCreationDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  
  let formattedLastUpdateDate = "";
  if (comanda.lastUpdatedTimestamp && comanda.lastUpdatedTimestamp !== comanda.timestamp) {
    const lastUpdateDate = new Date(comanda.lastUpdatedTimestamp);
    formattedLastUpdateDate = `${lastUpdateDate.toLocaleDateString('pt-BR')} às ${lastUpdateDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  }

  const comandaNumberDisplay = comanda.comandaNumber ? `Comanda Nº ${comanda.comandaNumber}` : `ID: ${comanda.id}`;

  const totalItemsAcrossSessions = comanda.sessions.reduce((count, session) => count + session.items.length, 0);

  return (
    <div className="bg-[#2c2c2c] rounded-xl p-4 sm:p-6 shadow-xl max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-600">
        <h3 className="font-['Lilita_One'] text-[#ff8f00] text-2xl sm:text-3xl">
          Detalhes da Comanda
        </h3>
        <button
          onClick={onBack}
          className="text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-md transition-colors"
          aria-label="Voltar à lista de comandas"
        >
          <i className="fas fa-arrow-left mr-1 sm:mr-2"></i>
          <span className="hidden sm:inline">Voltar à Lista</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-4">
        <DetailItem label="Referência" value={comandaNumberDisplay} valueClass="text-amber-500 text-base sm:text-lg break-all" fullWidth={true} />
        {comanda.customerName && (
          <DetailItem label="Cliente" value={comanda.customerName} valueClass="text-gray-100 font-medium" />
        )}
        <DetailItem label="Criada em" value={formattedCreationDate} isTime={true}/>
        {formattedLastUpdateDate && (
            <DetailItem label="Última Atualização" value={formattedLastUpdateDate} valueClass="text-gray-400" isTime={true}/>
        )}
        <DetailItem label="Status Atual" value={<StatusBadgeDetail status={comanda.status} />} />
        <DetailItem label="Total Geral" value={`R$${comanda.totalAmount.toFixed(2).replace('.', ',')}`} valueClass="text-green-400 font-bold text-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-700">
        <div>
            <h4 className="text-base font-semibold text-amber-400 mb-1">Atualizar Status:</h4>
            <select
                value={comanda.status}
                onChange={(e) => onUpdateStatus(comanda.id, e.target.value as ComandaStatus)}
                className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#ffc107] focus:border-[#ffc107] w-full"
                aria-label="Selecionar novo status da comanda"
            >
                {ALL_COMANDA_STATUSES.map(statusValue => (
                <option key={statusValue} value={statusValue}>
                    {statusValue}
                </option>
                ))}
            </select>
        </div>
        <div className="sm:text-right">
             {/* Invisible placeholder for alignment on small screens, actual label for clarity */}
            <h4 className="text-base font-semibold text-amber-400 mb-1 sm:invisible md:visible">Ações Adicionais:</h4>
            <button
                onClick={() => onOpenAddItemsToExistingComanda(comanda.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors w-full"
            >
                <i className="fas fa-plus mr-2"></i>Adicionar Mais Itens
            </button>
        </div>
      </div>


      <h4 className="text-xl font-semibold text-amber-400 mb-3 mt-8 pt-4 border-t border-gray-700">Itens da Comanda:</h4>
      {totalItemsAcrossSessions > 0 ? (
        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
          {comanda.sessions.map((session: ComandaSession, sessionIndex: number) => (
            <div key={session.timestamp} className="bg-[#222222] p-3 rounded-lg shadow">
              <div className="mb-3 pb-2 border-b border-gray-600">
                <p className="text-sm font-semibold text-sky-400">
                  {sessionIndex === 0 ? "Itens Iniciais Adicionados em:" : "Itens Adicionais Adicionados em:"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(session.timestamp).toLocaleDateString('pt-BR')} às {new Date(session.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              {session.items.length > 0 ? (
                <ul className="space-y-3">
                  {session.items.map((item: OrderItem) => (
                    <li key={item.id} className="bg-[#3a3a3a] p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-gray-100">{item.name}</span>
                          <span className="text-sm text-gray-400 block"> (Qtd: {item.quantity})</span>
                        </div>
                        <span className="font-medium text-green-300">
                          R${calculateLineItemTotal(item).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="pl-4 mt-2 pt-2 border-t border-gray-500 border-opacity-50 text-xs">
                          <span className="text-amber-300 font-medium">Adicionais:</span>
                          {item.selectedAddons.map((addonEntry) => (
                            <div key={addonEntry.addonItem.id + '-' + item.id + '-' + addonEntry.addonItem.name} className="text-gray-400 ml-2"> {/* Ensure unique key for addons */}
                              + {addonEntry.addonItem.name} (Qtd: {addonEntry.quantity})
                              <span className="ml-1">R${(addonEntry.addonItem.price * addonEntry.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">Nenhum item nesta sessão.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Nenhum item nesta comanda.</p>
      )}
    </div>
  );
};

export default ComandaDetail;