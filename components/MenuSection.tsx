
import React from 'react';
import { MenuItem, MenuCategory } from '../types';
import MenuItemCard from './MenuItemCard';
import { theme } from '../styles/theme';

interface MenuSectionProps {
  category: MenuCategory;
  onAddItem: (item: MenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ category, onAddItem }) => {
  const titleSizeClass = category.title === "MOLHOS" || category.title === "BEBIDAS" ? `text-[${theme.fontSizes['2xl']}]` : `text-[${theme.fontSizes['3xl']}]`;
  
  return (
    <section className="mb-8">
      <h2 
        className={`text-[${theme.colors.secondary}] ${titleSizeClass} mb-6 border-b-2 border-[${theme.colors.secondary}] pb-2`}
        style={{ fontFamily: theme.fonts.heading }}
      >
        {category.title}
      </h2>
      <div className={`grid grid-cols-1 ${category.gridCols || 'md:grid-cols-2'} gap-x-6 gap-y-2`}>
        {category.items.map(item => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            onAddItem={onAddItem} 
            customClass={category.itemCustomClass}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
