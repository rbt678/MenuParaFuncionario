import { MenuItem, MenuCategory, MenuGroup } from '../types';

// Define individual addon items for reusability
const AD_OVO: MenuItem = { id: 'ad_ovo', name: 'OVO FRITO', price: 3.50, category: 'ADICIONAL', isSmallCard: true };
const AD_CEBOLA_CARAMELIZADA: MenuItem = { id: 'ad_cebola_caramelizada', name: 'CEBOLA CARAMELIZADA', price: 4.00, category: 'ADICIONAL', isSmallCard: true };
const AD_GELEIA_PIMENTA: MenuItem = { id: 'ad_geleia_pimenta', name: 'GELEIA DE PIMENTA', price: 3.00, category: 'ADICIONAL', isSmallCard: true };
const AD_QUEIJO_BRIE: MenuItem = { id: 'ad_queijo_brie', name: 'QUEIJO BRIE', price: 6.00, category: 'ADICIONAL', isSmallCard: true };
const AD_COGUMELOS: MenuItem = { id: 'ad_cogumelos', name: 'MIX DE COGUMELOS', price: 5.50, category: 'ADICIONAL', isSmallCard: true };

// List of all possible addons
export const adicionalItems: MenuItem[] = [
  AD_OVO,
  AD_CEBOLA_CARAMELIZADA,
  AD_GELEIA_PIMENTA,
  AD_QUEIJO_BRIE,
  AD_COGUMELOS,
];

const sanduicheItems: MenuItem[] = [
  { 
    id: 'sg_classico', 
    name: 'CLÁSSICO DA CASA', 
    price: 32.90, 
    description: 'Pão artesanal, blend de carnes da casa, queijo prato, alface americana, tomate e maionese defumada.', 
    category: 'SANDUICHE_GOURMET',
    availableAddons: [AD_OVO, AD_CEBOLA_CARAMELIZADA, AD_QUEIJO_BRIE]
  },
  { 
    id: 'sg_vegetariano', 
    name: 'VEGETARIANO SABOROSO', 
    price: 28.50, 
    description: 'Pão brioche, hambúrguer de grão de bico, queijo coalho, rúcula, tomate seco e pesto de manjericão.', 
    category: 'SANDUICHE_GOURMET',
    availableAddons: [AD_OVO, AD_COGUMELOS, AD_GELEIA_PIMENTA]
  },
  { 
    id: 'sg_frango_crispy', 
    name: 'FRANGO CROCANTE E PICANTE', 
    price: 30.90, 
    description: 'Pão australiano, frango crocante empanado, coleslaw, picles de pepino e maionese picante.', 
    category: 'SANDUICHE_GOURMET',
    availableAddons: [AD_OVO, AD_GELEIA_PIMENTA]
  },
];

const saladaItems: MenuItem[] = [
  { 
    id: 'sd_caesar', 
    name: 'SALADA CAESAR COM FRANGO', 
    price: 26.00, 
    description: 'Mix de folhas, frango grelhado em cubos, croutons, parmesão e molho Caesar.', 
    category: 'SALADAS',
    availableAddons: [AD_OVO]
  },
  { 
    id: 'sd_caprese', 
    name: 'SALADA CAPRESE', 
    price: 24.50, 
    description: 'Tomates frescos, muçarela de búfala, manjericão e molho pesto.', 
    category: 'SALADAS',
    availableAddons: []
  },
];

const acompanhamentoItems: MenuItem[] = [
  { id: 'ac_fritas_trufadas', name: 'BATATA FRITA TRUFADA', price: 18.00, category: 'ACOMPANHAMENTOS', isSmallCard: true },
  { id: 'ac_aneis_cebola', name: 'ANÉIS DE CEBOLA', price: 16.00, category: 'ACOMPANHAMENTOS', isSmallCard: true },
  { id: 'ac_salada_da_casa', name: 'MINI SALADA DA CASA', price: 12.00, category: 'ACOMPANHAMENTOS', isSmallCard: true },
];

const bebidaItems: MenuItem[] = [
  { id: 'be_suco_natural', name: 'SUCO NATURAL DO DIA', price: 9.00, category: 'BEBIDAS', isSmallCard: true },
  { id: 'be_soda_italiana', name: 'SODA ITALIANA (LIMÃO SICILIANO)', price: 11.00, category: 'BEBIDAS', isSmallCard: true },
  { id: 'be_cha_gelado', name: 'CHÁ GELADO DA CASA', price: 8.00, category: 'BEBIDAS', isSmallCard: true },
  { id: 'be_cafe_especial', name: 'CAFÉ ESPRESSO ESPECIAL', price: 7.00, category: 'BEBIDAS', isSmallCard: true },
  { id: 'be_agua', name: 'ÁGUA MINERAL', price: 5.00, category: 'BEBIDAS', isSmallCard: true },
];

// Defines the layout structure for the menu in App.tsx
export const MENU_LAYOUT_GROUPS: MenuGroup[] = [
  {
    id: 'pratos_principais',
    layoutClassesForGroupContainer: 'grid grid-cols-1 md:grid-cols-2 gap-x-8',
    categories: [
      { title: 'SANDUÍCHES GOURMET', items: sanduicheItems, gridCols: 'md:grid-cols-2' }, 
      { title: 'SALADAS FRESCAS', items: saladaItems, gridCols: 'md:grid-cols-2' }, 
    ]
  },
  {
    id: 'extras_e_bebidas',
    layoutClassesForGroupContainer: 'grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-0 md:mt-8',
    categories: [
      { title: 'ACOMPANHAMENTOS', items: acompanhamentoItems, gridCols: 'md:grid-cols-1', itemCustomClass: '!p-3' }, 
      { title: 'BEBIDAS ESPECIAIS', items: bebidaItems, gridCols: 'md:grid-cols-1', itemCustomClass: '!p-3' },
    ]
  }
];

// Export all individual categories for easier access in other modules
export const MENU_CATEGORIES: MenuCategory[] = MENU_LAYOUT_GROUPS.flatMap(group => group.categories);