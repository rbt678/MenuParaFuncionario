
import React from 'react';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

interface ViewSwitcherProps {
  activeView: 'menu' | 'manageComandas';
  onViewChange: (view: 'menu' | 'manageComandas') => void;
  isAddingToExistingComanda: boolean;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, onViewChange, isAddingToExistingComanda }) => {
  const getButtonClass = (viewName: 'menu' | 'manageComandas') => {
    let baseClass = `py-2 px-4 rounded-md font-semibold transition-colors duration-200`;
    if (isAddingToExistingComanda && viewName !== 'menu') {
        baseClass += ` opacity-50 cursor-not-allowed bg-[${theme.colors.surfaceLight}] text-[${theme.colors.textDisabled}]`;
    } else if (activeView === viewName) {
        baseClass += ` bg-[${theme.colors.primary}] text-[${theme.colors.textOnPrimary}]`;
    } else {
        baseClass += ` bg-[${theme.colors.surface}] text-[${theme.colors.textSecondary}] hover:bg-[${theme.colors.surfaceLight}] hover:text-[${theme.colors.textPrimary}]`;
    }
    return baseClass;
  };

  const handleViewChange = (view: 'menu' | 'manageComandas') => {
    if (isAddingToExistingComanda && view !== 'menu') {
        return; 
    }
    onViewChange(view);
  }

  return (
    <nav className="flex justify-center gap-4 my-6">
      <button 
        onClick={() => handleViewChange('menu')} 
        className={getButtonClass('menu')}
        aria-pressed={activeView === 'menu'}
        disabled={isAddingToExistingComanda && activeView !== 'menu'}
      >
        {TEXTS.VIEW_MENU}
      </button>
      <button 
        onClick={() => handleViewChange('manageComandas')} 
        className={getButtonClass('manageComandas')}
        aria-pressed={activeView === 'manageComandas'}
        disabled={isAddingToExistingComanda}
      >
        {TEXTS.VIEW_MANAGE_COMANDAS}
      </button>
    </nav>
  );
};

export default ViewSwitcher;
