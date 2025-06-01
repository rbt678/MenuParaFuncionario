
import React from 'react';
import { Comanda, ComandaStatus, SetModalConfig, ShowToastFn } from '../types';
import ComandaList from './ComandaList';
import ComandaDetail from './ComandaDetail';
import { exportComandasToText, importComandasFromText } from '../utils/comandaTextExporterImporter';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';


interface ManageComandasViewProps {
  comandas: Comanda[];
  selectedComanda: Comanda | null;
  onSelectComanda: (comanda: Comanda) => void;
  onClearSelectedComanda: () => void;
  onUpdateComandaStatus: (comandaId: string, newStatus: ComandaStatus) => void;
  onOpenAddItemsToExistingComanda: (comandaId: string) => void;
  setModalConfig: SetModalConfig; 
  showToast: ShowToastFn;
  onImportComandas: (importedComandas: Comanda[]) => { successCount: number; duplicateCount: number };
  onDeleteComanda: (comandaId: string) => void;
}

const ManageComandasView: React.FC<ManageComandasViewProps> = ({ 
  comandas, 
  selectedComanda, 
  onSelectComanda, 
  onClearSelectedComanda,
  onUpdateComandaStatus,
  onOpenAddItemsToExistingComanda,
  setModalConfig,
  showToast,
  onImportComandas,
  onDeleteComanda,
}) => {

  const handleExportComandas = () => {
    if (comandas.length === 0) {
      showToast(TEXTS.TOAST_NO_COMANDAS_TO_EXPORT, "info");
      return;
    }
    const exportedText = exportComandasToText(comandas);
    setModalConfig({
      isOpen: true,
      message: TEXTS.MODAL_EXPORT_PROMPT,
      textareaLabel: TEXTS.MODAL_EXPORT_TEXTAREA_LABEL,
      initialTextareaValue: exportedText,
      textareaRows: 10,
      confirmText: TEXTS.CLOSE,
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      showCancelButton: false,
      extraActions: [{
        text: TEXTS.MODAL_BUTTON_COPY_TEXT,
        onClick: (_input, textareaValue) => {
          if (textareaValue) {
            navigator.clipboard.writeText(textareaValue).then(() => {
              showToast(TEXTS.TOAST_TEXT_COPIED_SUCCESS, "success");
            }, () => {
              showToast(TEXTS.TOAST_TEXT_COPIED_FAIL, "error");
            });
          } else {
            showToast(TEXTS.TOAST_NO_TEXT_TO_COPY, "info");
          }
        },
        className: `bg-[${theme.colors.accentBlue}] hover:bg-[${theme.colors.accentBlueDark}] text-[${theme.colors.textOnAccent}]`
      }]
    });
  };

  const handleRequestImportComandas = () => {
    setModalConfig({
      isOpen: true,
      message: TEXTS.MODAL_IMPORT_PROMPT,
      textareaLabel: TEXTS.MODAL_IMPORT_TEXTAREA_LABEL,
      textareaPlaceholder: TEXTS.MODAL_IMPORT_TEXTAREA_PLACEHOLDER,
      initialTextareaValue: "",
      textareaRows: 10,
      confirmText: TEXTS.MODAL_IMPORT_BUTTON,
      onConfirm: (_inputValue, textareaValue) => {
        if (!textareaValue || textareaValue.trim() === "") {
          showToast(TEXTS.TOAST_NO_IMPORT_TEXT_PROVIDED, "error");
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          return;
        }
        try {
          const { newComandas, errors } = importComandasFromText(textareaValue);
          
          if (errors.length > 0) {
            console.warn("Erros durante a importação:", errors);
            showToast(`${TEXTS.TOAST_IMPORT_WITH_ALERTS_PREFIX}${errors.length}${TEXTS.TOAST_IMPORT_WITH_ALERTS_SUFFIX}`, "info");
          }

          if (newComandas.length > 0) {
            const { successCount, duplicateCount } = onImportComandas(newComandas);
            let feedbackMessage = "";
            if (successCount > 0) {
                feedbackMessage += `${TEXTS.TOAST_IMPORT_SUCCESS_COUNT_PREFIX}${successCount}${TEXTS.TOAST_IMPORT_SUCCESS_COUNT_SUFFIX}`;
            }
            if (duplicateCount > 0) {
                feedbackMessage += `${TEXTS.TOAST_IMPORT_DUPLICATE_COUNT_PREFIX}${duplicateCount}${TEXTS.TOAST_IMPORT_DUPLICATE_COUNT_SUFFIX}`;
            }
            if (successCount === 0 && duplicateCount === 0 && newComandas.length > 0){
                feedbackMessage = TEXTS.TOAST_IMPORT_NO_NEW_COMANDAS;
            } else if (newComandas.length === 0 && errors.length === 0) {
                 feedbackMessage = TEXTS.TOAST_IMPORT_NO_VALID_COMANDAS_FOUND;
            }
            if (feedbackMessage){
                showToast(feedbackMessage, successCount > 0 ? "success" : "info");
            }
          } else if (errors.length === 0) {
            showToast(TEXTS.TOAST_IMPORT_NO_VALID_COMANDAS_FOUND, "info");
          }
        } catch (error) {
          console.error("Erro crítico durante a importação:", error);
          showToast(TEXTS.TOAST_IMPORT_CRITICAL_ERROR, "error");
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      showCancelButton: true,
      cancelText: TEXTS.CANCEL
    });
  };

  const handleRequestDeleteComanda = (comandaId: string, comandaNumber?: number, customerName?: string) => {
    const comandaRef = comandaNumber ? `Nº ${comandaNumber}` : `ID ${comandaId.substring(0,6)}`;
    const clientInfo = customerName ? `${TEXTS.MODAL_DELETE_COMANDA_PROMPT_CLIENT_PREFIX}${customerName}` : '';

    setModalConfig({
        isOpen: true,
        message: `${TEXTS.MODAL_DELETE_COMANDA_PROMPT_PREFIX}${comandaRef}${clientInfo}${TEXTS.MODAL_DELETE_COMANDA_PROMPT_SUFFIX}`,
        confirmText: TEXTS.MODAL_DELETE_COMANDA_CONFIRM_BUTTON,
        onConfirm: () => {
            onDeleteComanda(comandaId);
            onClearSelectedComanda(); 
            showToast(`${TEXTS.TOAST_COMANDA_DELETED_PREFIX}${comandaRef}${TEXTS.TOAST_COMANDA_DELETED_SUFFIX}`, "success");
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
        showCancelButton: true,
        cancelText: TEXTS.CANCEL,
    });
  };


  if (selectedComanda) {
    return (
      <ComandaDetail 
        comanda={selectedComanda} 
        onBack={onClearSelectedComanda} 
        onUpdateStatus={onUpdateComandaStatus}
        onOpenAddItemsToExistingComanda={onOpenAddItemsToExistingComanda} 
        onRequestDelete={handleRequestDeleteComanda}
      />
    );
  }

  return (
    <div>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-2 border-b-2 border-[${theme.colors.secondary}]`}>
        <h2 
          className={`text-[${theme.colors.secondary}] text-3xl`}
          style={{fontFamily: theme.fonts.heading}}
        >
          {TEXTS.MANAGE_COMANDAS_TITLE}
        </h2>
        <div className="flex gap-2 mt-3 sm:mt-0 flex-wrap">
          <button
            onClick={handleExportComandas}
            className={`bg-[${theme.colors.accentBlue}] hover:bg-[${theme.colors.accentBlueDark}] text-[${theme.colors.textOnAccent}] font-semibold py-2 px-4 rounded-md transition-colors text-sm`}
            title={TEXTS.MANAGE_COMANDAS_EXPORT_BUTTON}
          >
            <i className="fas fa-file-export mr-2"></i>{TEXTS.MANAGE_COMANDAS_EXPORT_BUTTON}
          </button>
          <button
            onClick={handleRequestImportComandas}
            className={`bg-[${theme.colors.accentGreen}] hover:bg-[${theme.colors.accentGreenDark}] text-[${theme.colors.textOnAccent}] font-semibold py-2 px-4 rounded-md transition-colors text-sm`}
            title={TEXTS.MANAGE_COMANDAS_IMPORT_BUTTON}
          >
            <i className="fas fa-file-import mr-2"></i>{TEXTS.MANAGE_COMANDAS_IMPORT_BUTTON}
          </button>
        </div>
      </div>
      {comandas.length === 0 ? (
        <p className={`text-[${theme.colors.textDisabled}] text-center py-8 text-lg`}>{TEXTS.MANAGE_COMANDAS_NO_COMANDAS}</p>
      ) : (
        <ComandaList comandas={comandas} onSelectComanda={onSelectComanda} />
      )}
    </div>
  );
};

export default ManageComandasView;
