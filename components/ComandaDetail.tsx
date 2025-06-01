
import React from 'react';
import { Comanda, OrderItem, ComandaStatus, ALL_COMANDA_STATUSES, ComandaSession } from '../types';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface ComandaDetailProps {
  comanda: Comanda;
  onBack: () => void;
  onUpdateStatus: (comandaId: string, newStatus: ComandaStatus) => void;
  onOpenAddItemsToExistingComanda: (comandaId: string) => void;
  onRequestDelete: (comandaId: string, comandaNumber?: number, customerName?: string) => void;
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; valueClass?: string; fullWidth?: boolean; isTime?: boolean }> = 
    ({ label, value, valueClass = `text-[${theme.colors.textPrimary}]`, fullWidth = false, isTime = false }) => (
  <div className={`min-w-0 mb-2.5 ${fullWidth ? 'md:col-span-2' : ''} ${isTime ? 'text-xs' : ''}`}>
    <span className={`font-semibold text-[${theme.colors.primaryLight}] break-words`}>{label}: </span>
    <span className={`${valueClass} break-words`}>{value}</span>
  </div>
);

const StatusBadgeDetail: React.FC<{ status: string }> = ({ status }) => {
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
    <span className={`px-3 py-1 text-sm font-bold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

const calculateLineItemTotal = (item: OrderItem): number => {
    const addonsTotal = item.selectedAddons?.reduce((sum, addonEntry) => {
        return sum + (addonEntry.addonItem.price * addonEntry.quantity);
    }, 0) || 0;
    return (item.price + addonsTotal) * item.quantity;
};


const ComandaDetail: React.FC<ComandaDetailProps> = ({ comanda, onBack, onUpdateStatus, onOpenAddItemsToExistingComanda, onRequestDelete }) => {
  const comandaCreationDate = new Date(comanda.timestamp); 
  const formattedCreationDate = `${comandaCreationDate.toLocaleDateString('pt-BR')} às ${comandaCreationDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  
  let formattedLastUpdateDate = "";
  if (comanda.lastUpdatedTimestamp && comanda.lastUpdatedTimestamp !== comanda.timestamp) {
    const lastUpdateDate = new Date(comanda.lastUpdatedTimestamp);
    formattedLastUpdateDate = `${lastUpdateDate.toLocaleDateString('pt-BR')} às ${lastUpdateDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  }

  const comandaNumberDisplay = comanda.comandaNumber 
    ? `${TEXTS.COMANDA_LIST_ITEM_COMANDA_NUMBER_PREFIX}${comanda.comandaNumber}` 
    : `${TEXTS.COMANDA_LIST_ITEM_ID_PREFIX}${comanda.id}`;

  const totalItemsAcrossSessions = comanda.sessions.reduce((count, session) => count + session.items.length, 0);

  return (
    <div className={`bg-[${theme.colors.surface}] rounded-xl p-4 sm:p-6 shadow-xl max-w-3xl mx-auto`}>
      <div className={`flex justify-between items-center mb-6 pb-3 border-b border-[${theme.colors.borderDark}]`}>
        <h3 
            className={`text-[${theme.colors.secondary}] text-2xl sm:text-3xl`}
            style={{fontFamily: theme.fonts.heading}}
        >
          {TEXTS.COMANDA_DETAIL_TITLE}
        </h3>
        <button
          onClick={onBack}
          className={`text-sm bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.borderLight}] text-[${theme.colors.textPrimary}] font-semibold py-2 px-3 rounded-md transition-colors`}
          aria-label={TEXTS.COMANDA_DETAIL_BACK_BUTTON_ARIA_LABEL}
        >
          <i className="fas fa-arrow-left mr-1 sm:mr-2"></i>
          <span className="hidden sm:inline">{TEXTS.COMANDA_DETAIL_BACK_BUTTON_TEXT}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-4">
        <DetailItem label={TEXTS.COMANDA_DETAIL_LABEL_REFERENCE} value={comandaNumberDisplay} valueClass={`text-[${theme.colors.primary}] text-base sm:text-lg break-all`} fullWidth={true} />
        {comanda.customerName && (
          <DetailItem label={TEXTS.COMANDA_DETAIL_LABEL_CUSTOMER} value={comanda.customerName} valueClass={`text-[${theme.colors.textPrimary}] font-medium`} />
        )}
        <DetailItem label={TEXTS.COMANDA_DETAIL_LABEL_CREATED_AT} value={formattedCreationDate} isTime={true}/>
        {formattedLastUpdateDate && (
            <DetailItem label={TEXTS.COMANDA_DETAIL_LABEL_UPDATED_AT} value={formattedLastUpdateDate} valueClass={`text-[${theme.colors.textSecondary}]`} isTime={true}/>
        )}
        <DetailItem label={TEXTS.COMANDA_DETAIL_LABEL_STATUS} value={<StatusBadgeDetail status={comanda.status} />} />
        <DetailItem label={TEXTS.COMANDA_DETAIL_LABEL_TOTAL} value={`R$${comanda.totalAmount.toFixed(2).replace('.', ',')}`} valueClass={`text-[${theme.colors.accentGreen}] font-bold text-lg`} />
      </div>

      <div className={`mt-6 pt-4 border-t border-[${theme.colors.borderDark}] space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:gap-4`}>
        <div className="flex-1">
            <h4 className={`text-base font-semibold text-[${theme.colors.primaryLight}] mb-1`}>{TEXTS.COMANDA_DETAIL_UPDATE_STATUS_LABEL}</h4>
            <select
                value={comanda.status}
                onChange={(e) => onUpdateStatus(comanda.id, e.target.value as ComandaStatus)}
                className={`bg-[${theme.colors.inputBackground}] text-[${theme.colors.textPrimary}] p-2 rounded-md border border-[${theme.colors.inputBorder}] focus:ring-1 focus:ring-[${theme.colors.inputFocusBorder}] focus:border-[${theme.colors.inputFocusBorder}] w-full`}
                aria-label={TEXTS.COMANDA_DETAIL_UPDATE_STATUS_ARIA_LABEL}
            >
                {ALL_COMANDA_STATUSES.map(statusValue => (
                <option key={statusValue} value={statusValue}>
                    {statusValue}
                </option>
                ))}
            </select>
        </div>
        <div className="flex-1">
            <h4 className={`text-base font-semibold text-[${theme.colors.primaryLight}] mb-1`}>{TEXTS.COMANDA_DETAIL_ADDITIONAL_ACTIONS_LABEL}</h4>
            <button
                onClick={() => onOpenAddItemsToExistingComanda(comanda.id)}
                className={`bg-[${theme.colors.accentBlue}] hover:bg-[${theme.colors.accentBlueDark}] text-[${theme.colors.textOnAccent}] font-semibold py-2 px-4 rounded-md transition-colors w-full`}
            >
                <i className="fas fa-plus mr-2"></i>{TEXTS.COMANDA_DETAIL_ADD_MORE_ITEMS_BUTTON}
            </button>
        </div>
      </div>

      <div className={`mt-8 pt-6 border-t border-[${theme.colors.borderDark}]`}>
        <h4 className={`text-lg font-semibold text-[${theme.colors.destructive}] mb-2 text-center sm:text-left`}>{TEXTS.COMANDA_DETAIL_DANGER_ZONE_TITLE}</h4>
        <button
          onClick={() => onRequestDelete(comanda.id, comanda.comandaNumber, comanda.customerName || undefined)}
          className={`w-full bg-[${theme.colors.destructive}] hover:bg-[${theme.colors.destructiveHover}] text-[${theme.colors.textOnAccent}] font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[${theme.colors.errorDark}] focus:ring-opacity-75`}
          aria-label={`${TEXTS.COMANDA_DETAIL_DELETE_BUTTON_ARIA_LABEL_PREFIX}${comandaNumberDisplay}`}
        >
          <i className="fas fa-trash-alt mr-2"></i>{TEXTS.COMANDA_DETAIL_DELETE_BUTTON_TEXT}
        </button>
      </div>


      <h4 className={`text-xl font-semibold text-[${theme.colors.primaryLight}] mb-3 mt-8 pt-4 border-t border-[${theme.colors.borderDark}]`}>{TEXTS.COMANDA_DETAIL_ITEMS_TITLE}</h4>
      {totalItemsAcrossSessions > 0 ? (
        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
          {comanda.sessions.map((session: ComandaSession, sessionIndex: number) => (
            <div key={session.timestamp} className={`bg-[${theme.colors.surfaceDark}] p-3 rounded-lg shadow`}>
              <div className={`mb-3 pb-2 border-b border-[${theme.colors.borderLight}]`}>
                <p className={`text-sm font-semibold text-[${theme.colors.accentBlue}]`}>
                  {sessionIndex === 0 ? TEXTS.COMANDA_DETAIL_SESSION_INITIAL_ITEMS : TEXTS.COMANDA_DETAIL_SESSION_ADDITIONAL_ITEMS}
                </p>
                <p className={`text-xs text-[${theme.colors.textSecondary}]`}>
                  {new Date(session.timestamp).toLocaleDateString('pt-BR')} às {new Date(session.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              {session.items.length > 0 ? (
                <ul className="space-y-3">
                  {session.items.map((item: OrderItem) => (
                    <li key={item.id} className={`bg-[${theme.colors.surfaceLight}] p-3 rounded-lg`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`font-semibold text-[${theme.colors.textPrimary}]`}>{item.name}</span>
                          <span className={`text-sm text-[${theme.colors.textSecondary}] block`}> (Qtd: {item.quantity})</span>
                        </div>
                        <span className={`font-medium text-[${theme.colors.accentGreen}]`}>
                          R${calculateLineItemTotal(item).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className={`pl-4 mt-2 pt-2 border-t border-[${theme.colors.borderDark}] border-opacity-50 text-xs`}>
                          <span className={`text-[${theme.colors.primary}] font-medium`}>Adicionais:</span>
                          {item.selectedAddons.map((addonEntry) => (
                            <div key={`${item.id}-${addonEntry.addonItem.id}`} className={`text-[${theme.colors.textSecondary}] ml-2`}> 
                              + {addonEntry.addonItem.name} (Qtd: {addonEntry.quantity})
                              <span className="ml-1">R${(addonEntry.addonItem.price * addonEntry.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                       {item.observation && (
                        <div className="mt-2 pt-2 border-t border-gray-600 border-opacity-30 text-xs">
                          <strong className={`text-[${theme.colors.primaryLight}] opacity-90`}>{TEXTS.COMANDA_DETAIL_OBSERVATION_LABEL} </strong>
                          <span className={`text-[${theme.colors.textSecondary}] italic`}>{item.observation}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`text-[${theme.colors.textDisabled}] text-sm italic`}>{TEXTS.COMANDA_DETAIL_NO_ITEMS}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-[${theme.colors.textDisabled}]`}>{TEXTS.COMANDA_DETAIL_NO_ITEMS}</p>
      )}
    </div>
  );
};

export default ComandaDetail;
