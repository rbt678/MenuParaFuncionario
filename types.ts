
import React from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subName?: string; // For additional text
  isSmallCard?: boolean; // To identify items that should use smaller card styling
  availableAddons?: MenuItem[]; // Defines specific addons available for this item
}

export interface OrderItem extends MenuItem {
  quantity: number;
  selectedAddons?: Array<{ addonItem: MenuItem; quantity: number }>; 
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
  gridCols?: string; // Tailwind classes for grid layout, e.g., 'md:grid-cols-2'
  itemCustomClass?: string; // Additional classes for menu items in this category
}

export interface MenuGroup {
  id: string;
  layoutClassesForGroupContainer: string;
  categories: MenuCategory[];
}

export interface ModalAction {
  text: string;
  onClick: (inputValue?: string, textareaValue?: string) => void;
  className?: string;
}

export interface ModalConfig {
  isOpen: boolean;
  message: string;
  onConfirm?: (inputValue?: string, textareaValue?: string) => void; 
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  showCancelButton?: boolean;
  inputLabel?: string; 
  inputPlaceholder?: string; 
  initialInputValue?: string; 
  textareaLabel?: string; 
  textareaPlaceholder?: string; 
  initialTextareaValue?: string; 
  textareaRows?: number; 
  onGenericClose?: () => void;
  extraActions?: ModalAction[]; // For additional buttons like "Copy Text"
}

export interface ToastConfig {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ComandaStatus = 'Pendente' | 'Em Preparo' | 'Pronto para Retirada' | 'Concluído' | 'Cancelado';

export const ALL_COMANDA_STATUSES: ComandaStatus[] = [
  'Pendente',
  'Em Preparo',
  'Pronto para Retirada',
  'Concluído',
  'Cancelado',
];

export interface ComandaSession {
  timestamp: number;
  items: OrderItem[];
}

export interface Comanda {
  id: string; // Unique ID for the comanda
  comandaNumber?: number; // Sequential number for the comanda
  timestamp: number; // When the comanda was initially created (first session)
  lastUpdatedTimestamp?: number; // When the comanda was last updated (status change, new session added)
  sessions: ComandaSession[]; // Array of sessions, each with its own items and timestamp
  totalAmount: number; // Grand total of all items across all sessions
  status: ComandaStatus;
  customerName?: string; // Optional: Name of the customer
}

// Types for Hook return values or parameters
export type SetModalConfig = React.Dispatch<React.SetStateAction<ModalConfig>>;
export type ShowToastFn = (message: string, type?: ToastConfig['type']) => void;

export type SetStringState = React.Dispatch<React.SetStateAction<string | null>>;
export type SetBooleanState = React.Dispatch<React.SetStateAction<boolean>>;
export type SetCurrentOrderState = React.Dispatch<React.SetStateAction<OrderItem[]>>;
export type SetComandasState = React.Dispatch<React.SetStateAction<Comanda[]>>;
export type SetSelectedComandaState = React.Dispatch<React.SetStateAction<Comanda | null>>;