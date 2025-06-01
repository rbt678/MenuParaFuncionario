
import React from 'react';
import { MenuItem } from '../types';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface MenuItemCardProps {
  item: MenuItem;
  onAddItem: (item: MenuItem) => void;
  customClass?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddItem, customClass }) => {
  const cardBaseClass = `bg-[${theme.colors.surface}] rounded-xl shadow-lg mb-4 transition-transform duration-200 ease-in-out flex flex-col h-full`;
  const cardPaddingClass = item.isSmallCard ? (customClass || "p-3") : "p-4";
  const hoverClass = "hover:-translate-y-0.5";

  const buttonText = item.isSmallCard 
    ? TEXTS.MENU_ITEM_ADD_BUTTON 
    : `${TEXTS.MENU_ITEM_ADD_BUTTON}${TEXTS.MENU_ITEM_ADD_TO_COMANDA_BUTTON_SUFFIX}`;

  return (
    <div className={`${cardBaseClass} ${cardPaddingClass} ${hoverClass}`}>
      <div className={`flex-grow ${item.isSmallCard ? 'text-center' : ''}`}>
        <h3 className={`font-bold text-[${theme.colors.primary}] ${item.isSmallCard ? 'text-base' : 'text-lg'} break-words`}>
          {item.name}
        </h3>

        {item.subName && (
          <p className={`text-sm text-[${theme.colors.textSecondary}] ${item.isSmallCard ? 'mt-0.5' : 'mt-1'} break-words`}>
            {item.subName}
          </p>
        )}

        {item.price > 0 && (
          <p className={`font-bold text-[${theme.colors.accentGreen}] ${item.isSmallCard ? 'text-base mt-1' : 'text-lg mt-1.5'} break-words`}>
            R${item.price.toFixed(2).replace('.', ',')}
          </p>
        )}
        
        {item.description && (
          <p className={`text-sm text-[${theme.colors.textSecondary}] ${item.isSmallCard ? 'mt-1.5' : 'mt-2'} break-words ${item.isSmallCard ? 'text-center' : 'text-left'}`}>
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-auto pt-3">
        <button
          onClick={() => onAddItem(item)}
          className={`w-full bg-[${theme.colors.primary}] text-[${theme.colors.textOnPrimary}] font-semibold rounded-md transition-colors duration-200 
                      ${item.isSmallCard ? 'py-1 text-sm' : 'py-2'}
                      hover:bg-[${theme.colors.primaryDark}]`}
          title={`${TEXTS.MENU_ITEM_ADD_BUTTON} ${item.name}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
