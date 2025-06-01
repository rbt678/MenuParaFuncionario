
import React from 'react';
import { Comanda, ComandaStatus } from '../types';
import ComandaList from './ComandaList';
import ComandaDetail from './ComandaDetail';

interface ManageComandasViewProps {
  comandas: Comanda[];
  selectedComanda: Comanda | null;
  onSelectComanda: (comanda: Comanda) => void;
  onClearSelectedComanda: () => void;
  onUpdateComandaStatus: (comandaId: string, newStatus: ComandaStatus) => void;
  onOpenAddItemsToExistingComanda: (comandaId: string) => void;
  onRequestDelete: (comandaId: string, comandaNumber?: number, customerName?: string) => void; // Added prop
}

const ManageComandasView: React.FC<ManageComandasViewProps> = ({ 
  comandas, 
  selectedComanda, 
  onSelectComanda, 
  onClearSelectedComanda,
  onUpdateComandaStatus,
  onOpenAddItemsToExistingComanda,
  onRequestDelete, // Destructure added prop
}) => {
  if (selectedComanda) {
    return (
      <ComandaDetail 
        comanda={selectedComanda} 
        onBack={onClearSelectedComanda} 
        onUpdateStatus={onUpdateComandaStatus}
        onOpenAddItemsToExistingComanda={onOpenAddItemsToExistingComanda}
        onRequestDelete={onRequestDelete} // Pass added prop
      />
    );
  }

  return (
    <div>
      <h2 className="font-['Lilita_One'] text-[#ff8f00] text-3xl mb-6 border-b-2 border-[#ff8f00] pb-2">
        Comandas Finalizadas
      </h2>
      {comandas.length === 0 ? (
        <p className="text-gray-400 text-center py-8 text-lg">Nenhuma comanda finalizada ainda.</p>
      ) : (
        <ComandaList comandas={comandas} onSelectComanda={onSelectComanda} />
      )}
    </div>
  );
};

export default ManageComandasView;