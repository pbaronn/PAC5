import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import './MenuCategorias.css';

const MenuCategorias = ({ onLogout, onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Dados mockados para as categorias
  const mockCategories = [
    'Sub-6',
    'Sub-7',
    'Sub-8',
    'Sub-9',
    'Sub-10',
    'Sub-11',
    'Sub-12',
    'Sub-13',
    'Sub-14',
    'Sub-15',
    'Sub-16',
    'Sub-17',
    'Sub-18',
    'Sub-19',
    'Sub-20'
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewCategory = (category) => {
    if (onNavigate) {
      onNavigate('visualizar-categoria', { categoryData: { name: category } });
    }
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('jogos-menu');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="student-search-container">
        <Header 
          activeNav="Categorias" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Categorias" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <CategoriesSidebar 
          activeItem="Categorias" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Menu Categorias</h1>
          
          {/* Header com busca centralizada */}
          <div className="categorias-header">
            <div className="search-container-centered">
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input-centered"
              />
              <Search size={20} className="search-icon-centered" />
            </div>
          </div>


          {/* Lista de categorias */}
          <div className="categories-container">
            <div className="categories-list">
              {filteredCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="category-item"
                  onClick={() => handleViewCategory(category)}
                >
                  <span className="category-name">{category}</span>
                </div>
              ))}
              
              {filteredCategories.length === 0 && (
                <div className="no-results">
                  <p>Nenhuma categoria encontrada.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuCategorias;
