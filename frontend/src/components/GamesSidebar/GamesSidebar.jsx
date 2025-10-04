import React from 'react';
import { Search, Plus, ArrowLeft, Shield} from 'lucide-react';
import './GamesSidebar.css';

const GamesSidebar = ({ activeItem = 'Jogos', onItemClick, onBack }) => {
  const sidebarItems = [
    { name: 'Jogos', icon: Shield, page: 'jogos-menu' },
    { name: 'Buscar Jogos', icon: Search, page: 'buscar-jogos' },
    { name: 'Cadastrar Jogo', icon: Plus, page: 'cadastrar-jogo' }
  ];

  return (
    <aside className="games-sidebar">
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

export default GamesSidebar;

