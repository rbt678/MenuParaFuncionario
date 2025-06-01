
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface AddonsSelectionModalProps {
  isOpen: boolean;
  availableAddons: MenuItem[];
  primaryItemName: string;
  onConfirm: (selectedAddons: Array<{ addonItem: MenuItem; quantity: number }>) => void;
  onSkip: () => void;
}

const AddonQuantitySelector: React.FC<{
  addon: MenuItem;
  quantity: number;
  onQuantityChange: (addonId: string, newQuantity: number) => void;
}> = ({ addon, quantity, onQuantityChange }) => {
  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(addon.id, quantity - 1);
    }
  };
  const handleIncrement = () => {
    onQuantityChange(addon.id, quantity + 1);
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-[${theme.colors.inputBackground}] rounded-lg hover:bg-[${theme.colors.surfaceDark}] transition-colors`}>
      <div>
        <span className={`text-[${theme.colors.primaryLight}] font-medium`}>{addon.name}</span>
        <span className={`text-[${theme.colors.accentGreen}] ml-2 text-sm`}>
          (R${addon.price.toFixed(2).replace('.', ',')})
        </span>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDecrement}
          className={`bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.borderLight}] text-[${theme.colors.textPrimary}] font-bold rounded-md w-7 h-7 text-sm leading-none disabled:opacity-50`}
          disabled={quantity === 0}
          aria-label={`Diminuir quantidade de ${addon.name}`}
        >
          -
        </button>
        <span className={`min-w-[2rem] text-center mx-2 text-[${theme.colors.textPrimary}]`}>{quantity}</span>
        <button
          onClick={handleIncrement}
          className={`bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.borderLight}] text-[${theme.colors.textPrimary}] font-bold rounded-md w-7 h-7 text-sm leading-none`}
          aria-label={`Aumentar quantidade de ${addon.name}`}
        >
          +
        </button>
      </div>
    </div>
  );
};


const AddonsSelectionModal: React.FC<AddonsSelectionModalProps> = ({
  isOpen,
  availableAddons,
  primaryItemName,
  onConfirm,
  onSkip,
}) => {
  const [selectedAddonsQuantities, setSelectedAddonsQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
      const initialQuantities: Record<string, number> = {};
      availableAddons.forEach(addon => {
        initialQuantities[addon.id] = 0; 
      });
      setSelectedAddonsQuantities(initialQuantities);
    }
  }, [isOpen, primaryItemName, availableAddons]);

  if (!isOpen) return null;

  const handleAddonQuantityChange = (addonId: string, newQuantity: number) => {
    setSelectedAddonsQuantities(prev => ({
      ...prev,
      [addonId]: Math.max(0, newQuantity), 
    }));
  };

  const handleConfirmClick = () => {
    const confirmedAddons = availableAddons
      .filter(addon => selectedAddonsQuantities[addon.id] > 0)
      .map(addon => ({
        addonItem: addon,
        quantity: selectedAddonsQuantities[addon.id],
      }));
    onConfirm(confirmedAddons);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addons-modal-title"
    >
      <div className={`bg-[${theme.colors.surface}] p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h3 
            id="addons-modal-title" 
            className={`text-[${theme.colors.primary}] text-2xl`}
            style={{fontFamily: theme.fonts.heading}}
            >
            {TEXTS.ADDONS_MODAL_TITLE_PREFIX}{primaryItemName}
          </h3>
          <button 
            onClick={onSkip}
            className={`text-[${theme.colors.textSecondary}] hover:text-[${theme.colors.primary}] text-2xl font-bold`}
            aria-label={TEXTS.CLOSE}
          >
            &times;
          </button>
        </div>
        
        <p className={`text-[${theme.colors.textSecondary}] mb-4 text-sm`}>{TEXTS.ADDONS_MODAL_SELECT_PROMPT}</p>

        <div className="overflow-y-auto flex-grow pr-2 space-y-3 mb-4">
          {availableAddons.map(addon => (
            <AddonQuantitySelector
              key={addon.id}
              addon={addon}
              quantity={selectedAddonsQuantities[addon.id] || 0}
              onQuantityChange={handleAddonQuantityChange}
            />
          ))}
        </div>
        
        <div className={`flex flex-col sm:flex-row justify-end gap-3 mt-auto pt-4 border-t border-[${theme.colors.borderDark}]`}>
          <button
            onClick={onSkip} 
            className={`bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.borderLight}] text-[${theme.colors.textPrimary}] font-semibold py-2 px-6 rounded-md transition-colors duration-200`}
          >
            {TEXTS.ADDONS_MODAL_SKIP_BUTTON}
          </button>
          <button
            onClick={handleConfirmClick}
            className={`bg-[${theme.colors.primary}] text-[${theme.colors.textOnPrimary}] font-semibold py-2 px-6 rounded-md hover:bg-[${theme.colors.primaryDark}] transition-colors duration-200`}
          >
            {TEXTS.ADDONS_MODAL_CONFIRM_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddonsSelectionModal;
