
import React from 'react';
import { OrderItem } from '../types';
import OrderItemCard from './OrderItemCard';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearOrder: () => void; 
  onFinalizeOrder: () => void; 
  addingToComandaId: string | null;
  targetComandaNumber?: number;
  title?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  orderItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearOrder,
  onFinalizeOrder,
  addingToComandaId,
  targetComandaNumber,
  title = TEXTS.ORDER_SUMMARY_TITLE_CURRENT
}) => {
  
  const calculateLineItemTotal = (item: OrderItem): number => {
    const addonsTotal = item.selectedAddons?.reduce((sum, addonEntry) => {
      return sum + (addonEntry.addonItem.price * addonEntry.quantity);
    }, 0) || 0;
    return (item.price + addonsTotal) * item.quantity;
  };

  const total = orderItems.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);

  const finalizeButtonText = addingToComandaId 
    ? `${TEXTS.ORDER_SUMMARY_ADD_TO_COMANDA_BUTTON_PREFIX}${targetComandaNumber || '...'}` 
    : TEXTS.ORDER_SUMMARY_FINALIZE_BUTTON;
  const clearButtonText = addingToComandaId 
    ? TEXTS.ORDER_SUMMARY_CANCEL_ADDITION_BUTTON 
    : TEXTS.ORDER_SUMMARY_CLEAR_BUTTON;

  const sectionClasses = `sticky top-8 p-1 ${addingToComandaId ? `ring-2 ring-[${theme.colors.accentBlue}] ring-inset rounded-lg shadow-[${theme.colors.accentBlue}/30] shadow-lg` : ''}`;
  const titleClasses = `text-2xl mb-6 border-b-2 pb-2 break-words ${
    addingToComandaId ? `text-[${theme.colors.accentBlue}] border-[${theme.colors.accentBlue}]` : `text-[${theme.colors.secondary}] border-[${theme.colors.secondary}]`
  }`;


  return (
    <section className={sectionClasses}>
      <div className={addingToComandaId ? "p-3" : ""}>
        <h2 className={titleClasses} style={{fontFamily: theme.fonts.heading}}>
          {title}
        </h2>
        <div id="current-order-items" className="mb-4 max-h-96 overflow-y-auto pr-1">
          {orderItems.length === 0 ? (
            <p className={`text-[${theme.colors.textDisabled}] text-center py-4`}>
              {addingToComandaId ? TEXTS.ORDER_SUMMARY_NO_ITEMS_ADDING : TEXTS.ORDER_SUMMARY_NO_ITEMS_CURRENT}
            </p>
          ) : (
            orderItems.map(item => (
              <OrderItemCard 
                key={item.id} 
                item={item} 
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))
          )}
        </div>
        <div className={`border-t-2 border-[${theme.colors.primaryDark}] pt-4`}>
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span className={`text-[${theme.colors.textPrimary}]`}>
                {TEXTS.ORDER_SUMMARY_TOTAL_LABEL}{addingToComandaId ? TEXTS.ORDER_SUMMARY_TOTAL_ADDING_SUFFIX : ""}:
            </span>
            <span id="order-total" className={`text-[${theme.colors.accentGreen}]`}>
              R${total.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              id="finalize-order-btn" 
              onClick={onFinalizeOrder}
              disabled={orderItems.length === 0}
              className={`flex-1 font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                          ${addingToComandaId 
                            ? `bg-[${theme.colors.accentBlue}] hover:bg-[${theme.colors.accentBlueDark}] text-[${theme.colors.textOnAccent}]` 
                            : `bg-[${theme.colors.success}] hover:bg-[${theme.colors.accentGreenDark}] text-[${theme.colors.textOnAccent}]`}`}
            >
              {finalizeButtonText}
            </button>
            <button 
              id="clear-order-btn" 
              onClick={onClearOrder}
              className={`flex-1 bg-[${theme.colors.destructive}] hover:bg-[${theme.colors.destructiveHover}] text-[${theme.colors.textOnAccent}] font-semibold py-2 px-4 rounded-md transition-colors duration-200`}
            >
              {clearButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
