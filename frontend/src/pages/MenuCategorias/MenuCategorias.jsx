import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users, Edit, Trash2, Eye } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService } from '../../services/api';
import './MenuCategorias.css';

const MenuCategorias = ({ onLogout, onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryService.getAll({ 
        ativo: true, 
        includeStudentCount: true 
      });
      
      console.log('Categorias carregadas:', response);
      setCategories(response.data || []);
      
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setError('Erro ao carregar categorias: ' + error.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewCategory = (category) => {
    if (onNavigate) {
      onNavigate('visualizar-categoria', { categoryData: category });
    }
  };

  const handleEditCategory = (category) => {
    if (onNavigate) {
      onNavigate('editar-categoria', { categoryData: category });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      showSuccessMessage('Categoria excluída com sucesso!');
      await loadCategories(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setError('Erro ao excluir categoria: ' + error.message);
    }
  };

  const handleCreateCategory = () => {
    if (onNavigate) {
      onNavigate('criar-categoria');
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
    (category.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="panel-header">
            <h1 className="panel-title">Menu Categorias</h1>
            <button 
              className="create-btn" 
              onClick={handleCreateCategory}
              title="Criar nova categoria"
            >
              <Plus size={16} />
              Nova Categoria
            </button>
          </div>
          
          {error && (
            <div className="error-message" style={{
              color: 'red',
              background: 'rgba(255,0,0,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid rgba(255,0,0,0.3)'
            }}>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="success-message" style={{
              color: 'green',
              background: 'rgba(0,255,0,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid rgba(0,255,0,0.3)'
            }}>
              {successMessage}
            </div>
          )}
          
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
          <div className="categorias-grid">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category._id} className="categoria-card">
                  <div className="categoria-header">
                    <div 
                      className="categoria-color" 
                      style={{ backgroundColor: category.cor || '#3B82F6' }}
                    ></div>
                    <h3 className="categoria-nome">{category.nome}</h3>
                    {category.descricao && (
                      <p className="categoria-descricao">{category.descricao}</p>
                    )}
                  </div>
                  
                  <div className="categoria-stats">
                    <div className="stat-item">
                      <Users size={16} />
                      <span>{category.totalAlunos || 0} alunos</span>
                    </div>
                  </div>
                  
                  <div className="categoria-actions">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewCategory(category)}
                      title="Visualizar categoria"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditCategory(category)}
                      title="Editar categoria"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteCategory(category._id)}
                      title="Excluir categoria"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-categories">
                <div className="empty-state">
                  <Users size={48} className="empty-icon" />
                  <h3>Nenhuma categoria encontrada</h3>
                  <p>
                    {searchTerm 
                      ? 'Nenhuma categoria corresponde aos critérios de busca.' 
                      : 'Ainda não há categorias cadastradas. Crie a primeira categoria para começar!'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      className="create-first-btn" 
                      onClick={handleCreateCategory}
                    >
                      <Plus size={16} />
                      Criar primeira categoria
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuCategorias;
