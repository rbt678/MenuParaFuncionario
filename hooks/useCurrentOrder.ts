
import { useState, useEffect, useCallback } from 'react';
import { OrderItem, MenuItem, ShowToastFn, SetModalConfig, SetStringState, SetCurrentOrderState } from '../types';
import { TEXTS } from '../constants/texts';

interface UseCurrentOrderParams {
  showToast: ShowToastFn;
  setModalConfig: SetModalConfig;
  comandas: import('../types').Comanda[];
}

interface UseCurrentOrderReturn {
  currentOrder: OrderItem[];
  setCurrentOrder: SetCurrentOrderState;
  addingToComandaId: string | null;
  setAddingToComandaId: SetStringState;
  processItemAdditionToCurrentOrder: (
    itemToAdd: MenuItem,
    selectedAddons?: Array<{ addonItem: MenuItem; quantity: number }>
  ) => void;
  handleUpdateOrderItemQuantity: (itemId: string, newQuantity: number) => void;
  handleRequestRemoveItemFromCurrentOrder: (itemId: string) => void;
  handleClearCurrentOrderOrCancelAddition: (
    isAddingMode: boolean, 
    onAddingCancelCallback: () => void
  ) => void;
}

const useCurrentOrder = ({ showToast, setModalConfig, comandas }: UseCurrentOrderParams): UseCurrentOrderReturn => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [addingToComandaId, setAddingToComandaId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedOrder = localStorage.getItem('OrderReact');
      if (storedOrder) {
        const parsedOrder = JSON.parse(storedOrder);
        if (Array.isArray(parsedOrder)) {
          setCurrentOrder(parsedOrder);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar comanda atual do localStorage:", error);
      showToast(TEXTS.TOAST_ERROR_LOADING_CURRENT_SAVED_ORDER, "error");
    }
  }, [showToast]);

  useEffect(() => {
    localStorage.setItem('OrderReact', JSON.stringify(currentOrder));
  }, [currentOrder]);

  const processItemAdditionToCurrentOrder = useCallback((
    itemToAdd: MenuItem,
    selectedAddons: Array<{ addonItem: MenuItem; quantity: number }> = []
  ) => {
    const newItem: OrderItem = { 
        ...itemToAdd, 
        id: `${itemToAdd.id}_${Date.now()}_${Math.random().toString(16).slice(2)}`, 
        quantity: 1, 
        selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined 
    };
    
    setCurrentOrder(prevOrder => [...prevOrder, newItem]);
    
    const targetComanda = addingToComandaId ? comandas.find(c => c.id === addingToComandaId) : null;
    const message = addingToComandaId 
        ? `${TEXTS.TOAST_ITEM_ADDED_TO_EXISTING_COMANDA_NAME_PREFIX}${itemToAdd.name}${TEXTS.TOAST_ITEM_ADDED_TO_EXISTING_COMANDA_NUMBER_MIDFIX}${targetComanda?.comandaNumber || '...'}${TEXTS.TOAST_ITEM_ADDED_TO_EXISTING_COMANDA_SUFFIX}`
        : `${TEXTS.TOAST_ITEM_ADDED_TO_CURRENT_ORDER_NAME_PREFIX}${itemToAdd.name}${TEXTS.TOAST_ITEM_ADDED_TO_CURRENT_ORDER_SUFFIX}`;
    showToast(message, 'success');
  }, [showToast, addingToComandaId, comandas]);


  const handleUpdateOrderItemQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCurrentOrder(prevOrder =>
      prevOrder.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0) 
    );
  }, []);

  const handleRequestRemoveItemFromCurrentOrder = useCallback((itemId: string) => {
    const itemToRemove = currentOrder.find(item => item.id === itemId);
    if (!itemToRemove) return;

    setModalConfig({
      isOpen: true,
      message: `${TEXTS.MODAL_REMOVE_ITEM_PROMPT_PREFIX}${itemToRemove.name}${TEXTS.MODAL_REMOVE_ITEM_PROMPT_SUFFIX}`,
      confirmText: TEXTS.REMOVE,
      onConfirm: () => {
        setCurrentOrder(prevOrder => prevOrder.filter(item => item.id !== itemId));
        showToast(`${TEXTS.TOAST_ITEM_REMOVED_NAME_PREFIX}${itemToRemove.name}${TEXTS.TOAST_ITEM_REMOVED_SUFFIX}`, 'info');
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      showCancelButton: true,
    });
  }, [currentOrder, showToast, setModalConfig]);

  const handleClearCurrentOrderOrCancelAddition = useCallback((
    isAddingMode: boolean, 
    onAddingCancelCallback: () => void
  ) => {
    if (!isAddingMode && currentOrder.length === 0) {
      showToast(TEXTS.TOAST_CURRENT_ORDER_ALREADY_EMPTY, "info");
      return;
    }
    if (isAddingMode && currentOrder.length === 0) {
      onAddingCancelCallback();
      return;
    }

    const message = isAddingMode
      ? TEXTS.MODAL_CLEAR_ORDER_ADDING_PROMPT
      : TEXTS.MODAL_CLEAR_ORDER_PROMPT;
      
    setModalConfig({
      isOpen: true,
      message: message,
      confirmText: isAddingMode ? TEXTS.MODAL_CLEAR_ORDER_ADDING_CONFIRM_BUTTON : TEXTS.MODAL_CLEAR_ORDER_CONFIRM_BUTTON,
      onConfirm: () => {
        setCurrentOrder([]);
        showToast(isAddingMode ? TEXTS.TOAST_ADDITION_CANCELED_ITEMS_CLEARED : TEXTS.TOAST_CURRENT_ORDER_CLEARED, 'success');
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        if (isAddingMode) {
          onAddingCancelCallback();
        }
      },
      onCancel: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      showCancelButton: true,
    });
  }, [currentOrder, showToast, setModalConfig]);


  return { 
    currentOrder, 
    setCurrentOrder,
    addingToComandaId, 
    setAddingToComandaId,
    processItemAdditionToCurrentOrder,
    handleUpdateOrderItemQuantity,
    handleRequestRemoveItemFromCurrentOrder,
    handleClearCurrentOrderOrCancelAddition,
  };
};

export default useCurrentOrder;
