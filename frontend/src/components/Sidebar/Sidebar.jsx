import React from 'react';
import { User, Users } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeItem = 'Cadastrar Aluno', onItemClick }) => {
  const sidebarItems = [
    { name: 'Cadastrar Aluno', icon: User, page: 'cadastra' },
    { name: 'Gerenciar Alunos', icon: Users, page: 'gerenciar' }
  ];

  return (
    <aside className="sidebar">
      {sidebarItems.map((item) => (
        <div 
          key={item.name}
          className={`sidebar-item ${activeItem === item.name ? 'active' : ''}`}
          onClick={() => {
            console.log('Sidebar: Clicou em', item.name, '->', item.page);
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

export default Sidebar;