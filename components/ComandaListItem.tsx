
import React from 'react';
import { Comanda } from '../types';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface ComandaListItemProps {
  comanda: Comanda;
  onSelect: () => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let bgColor = `bg-[${theme.colors.statusDefaultBg}]`;
  let textColor = `text-[${theme.colors.statusDefaultText}]`;

  switch (status) {
    case 'Pendente':
      bgColor = `bg-[${theme.colors.statusPendenteBg}]`;
      textColor = `text-[${theme.colors.statusPendenteText}]`;
      break;
    case 'Em Preparo':
      bgColor = `bg-[${theme.colors.statusEmPreparoBg}]`;
      textColor = `text-[${theme.colors.statusEmPreparoText}]`;
      break;
    case 'Pronto para Retirada':
      bgColor = `bg-[${theme.colors.statusProntoBg}]`;
      textColor = `text-[${theme.colors.statusProntoText}]`;
      break;
    case 'Concluído':
      bgColor = `bg-[${theme.colors.statusConcluidoBg}]`;
      textColor = `text-[${theme.colors.statusConcluidoText}]`;
      break;
    case 'Cancelado':
      bgColor = `bg-[${theme.colors.statusCanceladoBg}]`;
      textColor = `text-[${theme.colors.statusCanceladoText}]`;
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
  const comandaNumberDisplay = comanda.comandaNumber 
    ? `${TEXTS.COMANDA_LIST_ITEM_COMANDA_NUMBER_PREFIX}${comanda.comandaNumber}` 
    : `${TEXTS.COMANDA_LIST_ITEM_ID_PREFIX}${comanda.id.substring(0,8)}...`;

  return (
    <div className={`bg-[${theme.colors.surface}] rounded-xl p-4 shadow-lg transition-shadow hover:shadow-xl`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex-grow">
          <p className={`text-lg font-semibold text-[${theme.colors.primaryLight}]`}>
            {comandaNumberDisplay}
          </p>
          {comanda.customerName && (
            <p className={`text-lg text-[${theme.colors.textPrimary}] truncate`} title={comanda.customerName}>
              {TEXTS.COMANDA_LIST_ITEM_CUSTOMER_PREFIX}<span className={`text-[${theme.colors.primary}]`}>{comanda.customerName}</span>
            </p>
          )}
           <p className={`text-[${theme.colors.textSecondary}] ${comanda.customerName ? 'text-sm' : 'text-base'}`}>{formattedDate}</p>
        </div>
        <div className="flex flex-col sm:items-end items-start gap-2 mt-2 sm:mt-0 flex-shrink-0">
          <p className={`text-xl font-bold text-[${theme.colors.accentGreen}]`}>
            R${comanda.totalAmount.toFixed(2).replace('.', ',')}
          </p>
          <StatusBadge status={comanda.status} />
        </div>
      </div>
      <div className={`mt-4 pt-3 border-t border-[${theme.colors.borderDark}] flex justify-end`}>
        <button
          onClick={onSelect}
          className={`bg-[${theme.colors.primary}] text-[${theme.colors.textOnPrimary}] font-semibold py-2 px-4 rounded-md hover:bg-[${theme.colors.primaryDark}] transition-colors duration-200 text-sm`}
        >
          {TEXTS.COMANDA_LIST_ITEM_VIEW_DETAILS_BUTTON}
        </button>
      </div>
    </div>
  );
};

export default ComandaListItem;
