
import React, { useState, useEffect } from 'react';
import { ModalConfig } from '../types';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface ModalProps extends ModalConfig {
  onGenericClose?: () => void; 
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onGenericClose, 
  onCancel,       
  confirmText = TEXTS.CONFIRM,
  cancelText = TEXTS.CANCEL,
  showCancelButton = true,
  inputLabel,
  inputPlaceholder,
  initialInputValue = "",
  textareaLabel,
  textareaPlaceholder,
  initialTextareaValue = "",
  textareaRows = 5,
  extraActions,
}) => {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [textareaValue, setTextareaValue] = useState(initialTextareaValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialInputValue || "");
      setTextareaValue(initialTextareaValue || "");
    }
  }, [isOpen, initialInputValue, initialTextareaValue]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (onConfirm) {
      onConfirm(inputLabel ? inputValue : undefined, textareaLabel ? textareaValue : undefined);
    } else if (onGenericClose) { 
      onGenericClose();
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else if (onGenericClose) { 
      onGenericClose();
    }
  };
  
  const handleBackdropOrCloseButton = () => {
    if (onGenericClose) {
        onGenericClose();
    } else if (onCancel) { 
        onCancel();
    }
  }

  return (
    <div 
      onClick={handleBackdropOrCloseButton} 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-message"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`bg-[${theme.colors.surface}] p-6 rounded-xl shadow-xl w-full max-w-md text-center`}
      >
        <div className="flex justify-end mb-2">
            <button 
              onClick={handleBackdropOrCloseButton} 
              className={`text-[${theme.colors.textSecondary}] hover:text-[${theme.colors.primary}] text-2xl font-bold`}
              aria-label={TEXTS.CLOSE}
            >
                &times;
            </button>
        </div>
        <p id="modal-message" className={`text-lg text-[${theme.colors.textPrimary}] mb-4 break-words`}>{message}</p>
        
        {inputLabel && (
          <div className="mb-4 text-left">
            <label htmlFor="modal-input" className={`block text-sm font-medium text-[${theme.colors.primaryLight}] mb-1`}>
              {inputLabel}
            </label>
            <input
              type="text"
              id="modal-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className={`w-full bg-[${theme.colors.inputBackground}] text-[${theme.colors.textPrimary}] border border-[${theme.colors.inputBorder}] rounded-md p-2 focus:ring-[${theme.colors.focusRing}] focus:border-[${theme.colors.inputFocusBorder}]`}
            />
          </div>
        )}

        {textareaLabel && (
          <div className="mb-4 text-left">
            <label htmlFor="modal-textarea" className={`block text-sm font-medium text-[${theme.colors.primaryLight}] mb-1`}>
              {textareaLabel}
            </label>
            <textarea
              id="modal-textarea"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder={textareaPlaceholder}
              rows={textareaRows}
              className={`w-full bg-[${theme.colors.inputBackground}] text-[${theme.colors.textPrimary}] border border-[${theme.colors.inputBorder}] rounded-md p-2 focus:ring-[${theme.colors.focusRing}] focus:border-[${theme.colors.inputFocusBorder}] resize-y`}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 mt-6">
          {extraActions && extraActions.map((action, index) => (
            <button
              key={`extra-action-${index}`}
              onClick={() => action.onClick(inputLabel ? inputValue : undefined, textareaLabel ? textareaValue : undefined)}
              className={`${action.className || `bg-[${theme.colors.accentBlue}] hover:bg-[${theme.colors.accentBlueDark}]`} text-[${theme.colors.textOnAccent}] font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm`}
            >
              {action.text}
            </button>
          ))}
          {onConfirm && ( 
            <button
              onClick={handleConfirmClick}
              className={`bg-[${theme.colors.primary}] text-[${theme.colors.textOnPrimary}] font-semibold py-2 px-6 rounded-md hover:bg-[${theme.colors.primaryDark}] transition-colors duration-200`}
            >
              {confirmText}
            </button>
          )}
          {showCancelButton && onCancel && ( 
            <button
              onClick={handleCancelClick}
              className={`bg-[${theme.colors.surfaceLight}] hover:bg-[${theme.colors.borderLight}] text-[${theme.colors.textPrimary}] font-semibold py-2 px-6 rounded-md transition-colors duration-200`}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
