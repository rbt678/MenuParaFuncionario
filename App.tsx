
import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, Comanda, MenuGroup, ModalAction } from './types';
import { MENU_LAYOUT_GROUPS } from './data/menu';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuSection from './components/MenuSection';
import OrderSummary from './components/OrderSummary';
import Modal from './components/Modal';
import { ToastContainer } from './components/Toast';
import ViewSwitcher from './components/ViewSwitcher';
import ManageComandasView from './components/ManageComandasView';
import AddonsSelectionModal from './components/AddonsSelectionModal';

import useModal from './hooks/useModal';
import useToasts from './hooks/useToasts';
import useComandas from './hooks/useComandas';
import useCurrentOrder from './hooks/useCurrentOrder';

import { theme } from './styles/theme';
import { TEXTS } from './constants/texts';

const App: React.FC = () => {
  const { modalConfig, setModalConfig, showModal, closeModal: NATIVE_CLOSE_MODAL_FROM_HOOK } = useModal();
  const { toasts, showToast, dismissToast } = useToasts();
  
  const [appSelectedComanda, setAppSelectedComanda] = useState<Comanda | null>(null);

  const {
    comandas,
    selectedComanda, 
    setSelectedComanda, 
    finalizeNewComanda,
    updateComandaStatus,
    addItemsToExistingComanda,
    deleteComanda,
    importComandas, 
    handleSelectComanda,
    handleClearSelectedComanda,
  } = useComandas({ showToast, setModalConfig, setSelectedComandaForApp: setAppSelectedComanda });

  const {
    currentOrder,
    setCurrentOrder,
    addingToComandaId,
    setAddingToComandaId,
    processItemAdditionToCurrentOrder,
    handleUpdateOrderItemQuantity,
    handleUpdateOrderItemObservation, // Added from hook
    handleRequestRemoveItemFromCurrentOrder,
    handleClearCurrentOrderOrCancelAddition,
  } = useCurrentOrder({ showToast, setModalConfig, comandas });

  const [activeView, setActiveView] = useState<'menu' | 'manageComandas'>('menu');
  const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [itemPendingAddons, setItemPendingAddons] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (selectedComanda !== appSelectedComanda) {
       setAppSelectedComanda(selectedComanda);
    }
  }, [selectedComanda, appSelectedComanda]);


  const handleAddItemFlowStart = (itemToAdd: MenuItem) => {
    if (itemToAdd.availableAddons && itemToAdd.availableAddons.length > 0) {
      setItemPendingAddons(itemToAdd);
      setIsAddonsModalOpen(true);
      const toastMessage = addingToComandaId
        ? `${TEXTS.TOAST_ADDING_ITEM_TO_EXISTING_SELECT_ADDONS_PREFIX}${itemToAdd.name}${TEXTS.TOAST_ADDING_ITEM_TO_EXISTING_SELECT_ADDONS_SUFFIX}`
        : `${TEXTS.TOAST_ADDING_ITEM_SELECT_ADDONS_PREFIX}${itemToAdd.name}${TEXTS.TOAST_ADDING_ITEM_SELECT_ADDONS_SUFFIX}`;
      showToast(toastMessage, 'info');
    } else {
      processItemAdditionToCurrentOrder(itemToAdd, []);
    }
  };

  const handleConfirmAddonsSelection = (addons: Array<{ addonItem: MenuItem; quantity: number }>) => {
    if (itemPendingAddons) {
      processItemAdditionToCurrentOrder(itemPendingAddons, addons);
    }
    setIsAddonsModalOpen(false);
    setItemPendingAddons(null);
  };

  const handleSkipAddonsSelection = () => {
    if (itemPendingAddons) {
      processItemAdditionToCurrentOrder(itemPendingAddons, []); // Process with no addons
    }
    setIsAddonsModalOpen(false);
    setItemPendingAddons(null);
  };
  
  const handleAddItemToCurrentOrderMain = (itemToAdd: MenuItem) => {
    // Check if item (without addons choice yet) is already in order to increment quantity
    // This check is simplified; complex items with forced choices might need more specific logic here
    if (!(itemToAdd.availableAddons && itemToAdd.availableAddons.length > 0)) {
      const existingItemIndex = currentOrder.findIndex(
        item => item.name === itemToAdd.name && 
                (!item.selectedAddons || item.selectedAddons.length === 0) &&
                !item.observation // Also consider observation if it makes it unique
      );
      if (existingItemIndex > -1) {
        setCurrentOrder(prevOrder => {
          const updatedOrder = [...prevOrder];
          updatedOrder[existingItemIndex].quantity++;
          return updatedOrder;
        });
        showToast(`${TEXTS.TOAST_ITEM_QUANTITY_INCREASED_PREFIX}${itemToAdd.name}${TEXTS.TOAST_ITEM_QUANTITY_INCREASED_SUFFIX}`, 'success');
        return;
      }
    }
    // If item has addons or is new (or new variant), start the flow
    handleAddItemFlowStart(itemToAdd);
  };

  const cancelAddingToExistingAndReset = () => {
    showToast(TEXTS.TOAST_ADDITION_CANCELED, "info");
    setCurrentOrder([]);
    const comandaToReSelect = comandas.find(c => c.id === addingToComandaId);
    setAddingToComandaId(null);
    setActiveView('manageComandas');
    if (comandaToReSelect) {
        setSelectedComanda(comandaToReSelect); 
    } else {
        setSelectedComanda(null); 
    }
  };

  const handleFinalizeAction = () => {
    if (currentOrder.length === 0) {
      showToast(TEXTS.TOAST_FINALIZE_ADD_ITEMS_FIRST, "error");
      return;
    }

    if (addingToComandaId) {
      addItemsToExistingComanda(addingToComandaId, currentOrder);
      setCurrentOrder([]);
      setAddingToComandaId(null);
      setActiveView('manageComandas');
    } else {
      showModal({
        message: TEXTS.MODAL_FINALIZE_COMANDA_CONFIRM_PROMPT,
        confirmText: TEXTS.MODAL_FINALIZE_COMANDA_YES_BUTTON,
        onConfirm: () => {
          showModal({
            message: TEXTS.MODAL_CUSTOMER_NAME_PROMPT,
            inputLabel: TEXTS.MODAL_CUSTOMER_NAME_LABEL,
            inputPlaceholder: TEXTS.MODAL_CUSTOMER_NAME_PLACEHOLDER,
            confirmText: TEXTS.MODAL_SAVE_COMANDA_BUTTON,
            initialInputValue: "",
            onConfirm: (inputValue) => {
              finalizeNewComanda(currentOrder, inputValue);
              setCurrentOrder([]);
              NATIVE_CLOSE_MODAL_FROM_HOOK();
            },
            onCancel: () => { 
              finalizeNewComanda(currentOrder); 
              setCurrentOrder([]);
              showToast(TEXTS.TOAST_COMANDA_FINALIZED_WITHOUT_NAME, "info");
              NATIVE_CLOSE_MODAL_FROM_HOOK();
            },
            showCancelButton: true,
            cancelText: TEXTS.MODAL_FINALIZE_WITHOUT_NAME_BUTTON
          });
        },
        onCancel: () => { 
          NATIVE_CLOSE_MODAL_FROM_HOOK();
        },
        showCancelButton: true,
      });
    }
  };
  
  const handleOpenAddItemsToExistingComanda = (comandaId: string) => {
    const targetComanda = comandas.find(c => c.id === comandaId);
    if (!targetComanda) return;

    if (currentOrder.length > 0) {
        showModal({
            message: TEXTS.MODAL_CLEAR_BEFORE_ADD_ITEMS_PROMPT,
            confirmText: TEXTS.MODAL_CLEAR_BEFORE_ADD_ITEMS_CONFIRM_BUTTON,
            onConfirm: () => {
                setCurrentOrder([]);
                setAddingToComandaId(comandaId);
                setActiveView('menu');
                setSelectedComanda(null); 
                showToast(`${TEXTS.TOAST_ENTERING_ADD_MODE_PREFIX}${targetComanda.comandaNumber}${TEXTS.TOAST_ENTERING_ADD_MODE_SUFFIX}`, 'info');
                NATIVE_CLOSE_MODAL_FROM_HOOK();
            },
            cancelText: TEXTS.MODAL_CLEAR_BEFORE_ADD_ITEMS_CANCEL_BUTTON,
            onCancel: () => NATIVE_CLOSE_MODAL_FROM_HOOK(),
            showCancelButton: true,
        });
    } else {
        setCurrentOrder([]); 
        setAddingToComandaId(comandaId);
        setActiveView('menu');
        setSelectedComanda(null); 
        showToast(`${TEXTS.TOAST_ENTERING_ADD_MODE_PREFIX}${targetComanda.comandaNumber}${TEXTS.TOAST_ENTERING_ADD_MODE_SUFFIX}`, 'info');
    }
  };

  const handleRequestEditObservation = (itemId: string, currentObservation: string | undefined, itemName: string) => {
    const extraActions: ModalAction[] = [];
    if (currentObservation && currentObservation.trim() !== "") {
        extraActions.push({
            text: TEXTS.MODAL_OBSERVATION_REMOVE_BUTTON,
            onClick: () => {
                handleUpdateOrderItemObservation(itemId, ""); // Empty string will be treated as removal
                NATIVE_CLOSE_MODAL_FROM_HOOK();
            },
            className: `bg-[${theme.colors.destructive}] hover:bg-[${theme.colors.destructiveHover}] text-[${theme.colors.textOnAccent}]`
        });
    }

    showModal({
        message: `${TEXTS.MODAL_OBSERVATION_TITLE_PREFIX}"${itemName}"`,
        textareaLabel: TEXTS.MODAL_OBSERVATION_TEXTAREA_LABEL,
        textareaPlaceholder: TEXTS.MODAL_OBSERVATION_TEXTAREA_PLACEHOLDER,
        initialTextareaValue: currentObservation || "",
        textareaRows: 3,
        confirmText: TEXTS.MODAL_OBSERVATION_CONFIRM_BUTTON,
        onConfirm: (_inputValue, textareaValue) => {
            handleUpdateOrderItemObservation(itemId, textareaValue || "");
            NATIVE_CLOSE_MODAL_FROM_HOOK();
        },
        onCancel: NATIVE_CLOSE_MODAL_FROM_HOOK,
        showCancelButton: true,
        extraActions: extraActions.length > 0 ? extraActions : undefined,
    });
  };
  
  const primaryItemNameForAddons = itemPendingAddons?.name || "";

  const orderSummaryTitle = addingToComandaId 
    ? `${TEXTS.ORDER_SUMMARY_TITLE_ADDING_PREFIX}${comandas.find(c => c.id === addingToComandaId)?.comandaNumber || '...'}`
    : TEXTS.ORDER_SUMMARY_TITLE_CURRENT;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl min-h-screen flex flex-col">
      <Header />
      <ViewSwitcher 
        activeView={activeView} 
        onViewChange={(view) => {
            if (addingToComandaId && view !== 'menu') {
                showToast(TEXTS.TOAST_SWITCH_VIEW_FINISH_ADDITION_FIRST, "error");
                return;
            }
            setActiveView(view);
            if (view === 'menu' && addingToComandaId){ 
                 handleClearSelectedComanda();
            } else if (view === 'menu' && !addingToComandaId){
                 handleClearSelectedComanda(); 
            }
        }} 
        isAddingToExistingComanda={!!addingToComandaId}
      />
      
      <main className="flex-grow mt-6">
        {activeView === 'menu' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {addingToComandaId && (
                <div className={`mb-4 p-3 bg-[${theme.colors.info}] border border-[${theme.colors.accentBlueDark}] rounded-lg text-center text-[${theme.colors.infoText}]`}>
                  <p className="font-semibold">{`Você está adicionando itens à Comanda Nº ${comandas.find(c => c.id === addingToComandaId)?.comandaNumber}.`}</p>
                  <p className="text-sm">Os itens selecionados abaixo serão acrescentados a essa comanda ao clicar no botão de adicionar.</p>
                </div>
              )}
              {MENU_LAYOUT_GROUPS.map(group => (
                <div key={group.id} className={`${group.layoutClassesForGroupContainer} ${group.id !== MENU_LAYOUT_GROUPS[0].id ? 'mt-8' : ''}`}>
                  {group.categories.map(category => (
                    <MenuSection
                      key={category.title}
                      category={category}
                      onAddItem={handleAddItemToCurrentOrderMain}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <OrderSummary
                orderItems={currentOrder}
                onUpdateQuantity={handleUpdateOrderItemQuantity}
                onRemoveItem={handleRequestRemoveItemFromCurrentOrder}
                onClearOrder={() => handleClearCurrentOrderOrCancelAddition(!!addingToComandaId, cancelAddingToExistingAndReset)}
                onFinalizeOrder={handleFinalizeAction}
                addingToComandaId={addingToComandaId}
                targetComandaNumber={addingToComandaId ? comandas.find(c=>c.id === addingToComandaId)?.comandaNumber : undefined}
                title={orderSummaryTitle}
                onEditObservation={handleRequestEditObservation} // Passed here
              />
            </div>
          </div>
        )}

        {activeView === 'manageComandas' && (
          <ManageComandasView 
            comandas={comandas}
            selectedComanda={appSelectedComanda} 
            onSelectComanda={handleSelectComanda} 
            onClearSelectedComanda={handleClearSelectedComanda} 
            onUpdateComandaStatus={updateComandaStatus}
            onOpenAddItemsToExistingComanda={handleOpenAddItemsToExistingComanda}
            setModalConfig={setModalConfig}
            showToast={showToast}
            onImportComandas={importComandas}
            onDeleteComanda={deleteComanda}
          />
        )}
      </main>
      <Footer />
      <Modal
        {...modalConfig}
      />
      <AddonsSelectionModal
        isOpen={isAddonsModalOpen}
        availableAddons={itemPendingAddons?.availableAddons || []}
        primaryItemName={primaryItemNameForAddons}
        onConfirm={handleConfirmAddonsSelection}
        onSkip={handleSkipAddonsSelection}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
