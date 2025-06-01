
import React from 'react';
import { OrderItem } from '../types';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface OrderItemCardProps {
  item: OrderItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId:string) => void;
  onEditObservation: (itemId: string, currentObservation: string | undefined, itemName: string) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, onUpdateQuantity, onRemoveItem, onEditObservation }) => {
  
  const singleItemBasePrice = item.price;
  const singleItemAddonsPrice = item.selectedAddons?.reduce((sum, addonEntry) => {
    return sum + (addonEntry.addonItem.price * addonEntry.quantity);
  }, 0) || 0;
  
  const singleItemTotalPrice = singleItemBasePrice + singleItemAddonsPrice;
  const lineItemTotalPrice = singleItemTotalPrice * item.quantity;

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemoveItem(item.id); 
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className={`bg-[${theme.colors.surface}] rounded-xl p-3 mb-3 flex flex-col sm:flex-row justify-between items-start text-sm shadow-md`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start w-full">
            <div className="flex-grow min-w-0"> {/* Ensure this div can shrink and grow */}
                <div className="flex items-center">
                    <span className={`font-semibold text-[${theme.colors.primaryLight}] block break-words`}>{item.name}</span>
                    <button
                        onClick={() => onEditObservation(item.id, item.observation, item.name)}
                        className={`ml-2 text-[${theme.colors.accentBlue}] hover:text-[${theme.colors.accentBlueDark}] text-xs`}
                        aria-label={`${TEXTS.ORDER_ITEM_CARD_EDIT_OBSERVATION_ARIA_LABEL_PREFIX}${item.name}`}
                        title={TEXTS.ORDER_ITEM_CARD_EDIT_OBSERVATION_ARIA_LABEL_PREFIX + item.name}
                    >
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                </div>
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                <div className="pl-3 mt-1 text-xs">
                    <span className={`text-[${theme.colors.primary}] text-opacity-80`}>Adicionais:</span>
                    {item.selectedAddons.map(addonEntry => (
                    <div key={addonEntry.addonItem.id} className={`text-[${theme.colors.textSecondary}] ml-2 break-words`}>
                        + {addonEntry.addonItem.name} (Qtd: {addonEntry.quantity})
                        <span className="ml-1">R${(addonEntry.addonItem.price * addonEntry.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                    ))}
                </div>
                )}
                 {item.observation && (
                    <div className={`mt-1.5 pl-1 text-xs break-words`}>
                        <span className={`font-semibold text-[${theme.colors.primaryLight}] opacity-80`}>{TEXTS.ORDER_ITEM_CARD_OBSERVATION_LABEL} </span>
                        <span className={`text-[${theme.colors.textSecondary}] italic`}>{item.observation}</span>
                    </div>
                )}
            </div>
            <button 
                onClick={() => onRemoveItem(item.id)}
                className={`text-[${theme.colors.destructive}] hover:text-[${theme.colors.destructiveHover}] sm:hidden flex-shrink-0 ml-2 p-1`}
                aria-label={`Remover ${item.name} do pedido`}
            >
                <i className="fas fa-trash-alt"></i>
            </button>
        </div>
        
        <div className="flex items-center mt-2">
          <button 
            onClick={handleDecrement}
            className={`bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.surfaceDark}] text-[${theme.colors.textPrimary}] rounded-md px-2 py-0.5 text-xs`}
            aria-label={`Diminuir quantidade de ${item.name}`}
          >
            -
          </button>
          <span className={`mx-2 text-[${theme.colors.textPrimary}]`}>{item.quantity}</span>
          <button 
            onClick={handleIncrement}
            className={`bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.surfaceDark}] text-[${theme.colors.textPrimary}] rounded-md px-2 py-0.5 text-xs`}
            aria-label={`Aumentar quantidade de ${item.name}`}
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right mt-2 sm:mt-0 flex-shrink-0 flex flex-col items-end">
        <span className={`text-[${theme.colors.accentGreen}] block font-semibold`}>
          R${lineItemTotalPrice.toFixed(2).replace('.', ',')}
        </span>
        <button 
          onClick={() => onRemoveItem(item.id)}
          className={`text-[${theme.colors.destructive}] hover:text-[${theme.colors.destructiveHover}] mt-1 hidden sm:block p-1`}
          aria-label={`Remover ${item.name} do pedido`}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default OrderItemCard;
