
import { useState } from 'react';
import { ModalConfig, SetModalConfig } from '../types';
// import { TEXTS } from '../constants/texts'; // TEXTS can be imported if default texts are set here

interface UseModalReturn {
  modalConfig: ModalConfig;
  setModalConfig: SetModalConfig;
  showModal: (config: Omit<ModalConfig, 'isOpen'| 'onGenericClose'>) => void;
  closeModal: () => void;
}

const useModal = (): UseModalReturn => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    message: '',
    // confirmText: TEXTS.CONFIRM, // Example if defaults were managed here
    // cancelText: TEXTS.CANCEL,   // Example
  });

  const showModal = (config: Omit<ModalConfig, 'isOpen' | 'onGenericClose'>) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };
  
  const onGenericModalClose = () => {
     setModalConfig(prev => ({...prev, isOpen: false}));
  }

  return { 
    modalConfig: {...modalConfig, onGenericClose: onGenericModalClose },
    setModalConfig, 
    showModal, 
    closeModal 
  };
};

export default useModal;
