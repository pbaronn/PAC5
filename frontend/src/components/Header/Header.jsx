import React from 'react';
import { LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ activeNav = 'Alunos', onLogout, onNavigate }) => {
  const imagemJEC = '/img/brasao.png';
  const imagemAlunos = '/img/icon_jogador.png';
  const imagemCategorias = '/img/icon-categoria.png';
  const imagemJogos = '/img/icon_jogos.png';
  const imagemTreinos = '/img/icon_treinos.png';
  const imagemConfiguracoes = '/img/icon_configurações.png';

  const navItems = [
    { name: 'Alunos', icon: imagemAlunos, alt: 'Ícone de alunos' },
    { name: 'Categorias', icon: imagemCategorias, alt: 'Ícone de categorias' },
    { name: 'Jogos', icon: imagemJogos, alt: 'Ícone de jogos' },
    { name: 'Treinos', icon: imagemTreinos, alt: 'Ícone de treinos' },
    { name: 'Configurações', icon: imagemConfiguracoes, alt: 'Ícone de configurações' }
  ];

  const handleNavClick = (navItem) => {
    if (navItem === 'Alunos' && onNavigate) {
      onNavigate('gerenciar');
    } else if (navItem === 'Jogos' && onNavigate) {
      onNavigate('jogos-menu');
    }
    // Adicione outros handlers conforme necessário
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={imagemJEC} alt="Brasão do Clube" className="logo-image" />
      </div>

      <nav className="main-nav">
        {navItems.map((item) => (
          <div 
            key={item.name}
            className={`nav-item ${activeNav === item.name ? 'active' : ''}`}
            onClick={() => handleNavClick(item.name)}
          >
            <div className="nav-icon">
              <img src={item.icon} alt={item.alt} />
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <button className="exit-btn" onClick={onLogout}>
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </header>
  );
};

export default Header;