
import React from 'react';
import { Comanda } from '../types';

interface ComandaListItemProps {
  comanda: Comanda;
  onSelect: () => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor} whitespace-nowrap`}>
      {status}
    </span>
  );
};


const ComandaListItem: React.FC<ComandaListItemProps> = ({ comanda, onSelect }) => {
  const comandaDate = new Date(comanda.timestamp);
  const formattedDate = `${comandaDate.toLocaleDateString('pt-BR')} ${comandaDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  const comandaNumberDisplay = comanda.comandaNumber ? `Comanda Nº ${comanda.comandaNumber}` : `ID: ${comanda.id.substring(0,8)}...`;

  return (
    <div className="bg-[#2c2c2c] rounded-xl p-4 shadow-lg transition-shadow hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex-grow">
          <p className="text-lg font-semibold text-amber-500">
            {comandaNumberDisplay}
          </p>
          {comanda.customerName && (
            <p className="text-lg text-gray-100 truncate" title={comanda.customerName}>
              Cliente: <span className="text-amber-300">{comanda.customerName}</span>
            </p>
          )}
           <p className={`text-gray-200 ${comanda.customerName ? 'text-sm' : 'text-base'}`}>{formattedDate}</p>
        </div>
        <div className="flex flex-col sm:items-end items-start gap-2 mt-2 sm:mt-0 flex-shrink-0">
          <p className="text-xl font-bold text-green-400">
            R${comanda.totalAmount.toFixed(2).replace('.', ',')}
          </p>
          <StatusBadge status={comanda.status} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-600 flex justify-end">
        <button
          onClick={onSelect}
          className="bg-[#ffc107] text-[#1a1a1a] font-semibold py-2 px-4 rounded-md hover:bg-[#ffb300] transition-colors duration-200 text-sm"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ComandaListItem;
