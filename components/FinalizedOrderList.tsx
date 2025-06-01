
import React from 'react';
import { Comanda } from '../types';
import ComandaListItem from './ComandaListItem';

interface ComandaListProps {
  comandas: Comanda[];
  onSelectComanda: (comanda: Comanda) => void;
}

const ComandaList: React.FC<ComandaListProps> = ({ comandas, onSelectComanda }) => {
  // Sort comandas by comandaNumber, newest (highest number) first
  const sortedComandas = [...comandas].sort((a, b) => (b.comandaNumber || 0) - (a.comandaNumber || 0));

  return (
    <div className="space-y-4">
      {sortedComandas.map((comanda, index) => ( // index can be used if needed for other purposes
        <ComandaListItem 
          key={comanda.id} 
          comanda={comanda} 
          onSelect={() => onSelectComanda(comanda)} 
        />
      ))}
    </div>
  );
};

export default ComandaList;
