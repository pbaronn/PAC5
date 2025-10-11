import React from 'react';
import { Calendar, Plus, ArrowLeft } from 'lucide-react';
import './TreinosSidebar.css';

const TreinosSidebar = ({ activeItem = 'Treinos Agendados', onItemClick, showBackButton = false, onBackClick }) => {
  const sidebarItems = [
    { name: 'Treinos Agendados', icon: Calendar, page: 'treinos' },
    { name: 'Adicionar Treino', icon: Plus, page: 'adicionar-treino' }
  ];

  return (
    <aside className="treinos-sidebar">
      {showBackButton && (
        <div 
          className="sidebar-back"
          onClick={() => {
            console.log('TreinosSidebar: Clicou em Voltar');
            onBackClick && onBackClick();
          }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </div>
      )}
      {sidebarItems.map((item) => (
        <div 
          key={item.name}
          className={`sidebar-item ${activeItem === item.name ? 'active' : ''}`}
          onClick={() => {
            console.log('TreinosSidebar: Clicou em', item.name, '->', item.page);
            onItemClick && onItemClick(item.page);
          }}
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

export default TreinosSidebar;
