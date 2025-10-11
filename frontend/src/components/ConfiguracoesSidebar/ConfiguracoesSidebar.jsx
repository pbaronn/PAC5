import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import './ConfiguracoesSidebar.css';

const ConfiguracoesSidebar = ({ activeItem = 'Configurações', onItemClick, onBack }) => {
  const sidebarItems = [
    { name: 'Configurações', icon: Settings, page: 'configuracoes' }
  ];

  return (
    <aside className="configuracoes-sidebar">
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

export default ConfiguracoesSidebar;
