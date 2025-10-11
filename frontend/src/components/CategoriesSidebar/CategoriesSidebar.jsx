import React from 'react';
import { List, Plus, ArrowLeft } from 'lucide-react';
import './CategoriesSidebar.css';

const CategoriesSidebar = ({ activeItem = 'Categorias', onItemClick, onBack }) => {
  const sidebarItems = [
    { name: 'Categorias', icon: List, page: 'menu-categorias' },
    { name: 'Adicionar Categoria', icon: Plus, page: 'criar-categoria' }
  ];

  return (
    <aside className="categories-sidebar">
      <div className="sidebar-back" onClick={onBack}>
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </div>
      
      {sidebarItems.map((item) => (
        <div 
          key={item.name}
          className={`sidebar-item ${activeItem === item.name ? 'active' : ''}`}
          onClick={() => onItemClick && onItemClick(item.page)}
        >
          <div className="sidebar-icon">
            <item.icon size={24} />
          </div>
          <span>{item.name}</span>
        </div>
      ))}
    </aside>
  );
};

export default CategoriesSidebar;