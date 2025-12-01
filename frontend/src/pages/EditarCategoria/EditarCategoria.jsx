import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService } from '../../services/api';
import '../VisualizarCategoria/VisualizarCategoria.css'; // Usar o mesmo CSS
import './EditarCategoria.css';

const EditarCategoria = ({ onLogout, onNavigate, categoryData: rawCategoryData }) => {
  console.log('EditarCategoria RENDERIZADO - categoryData prop:', rawCategoryData);
  
  // Extrair dados corretos da estrutura (pode vir como {data: {...}} ou direto)
  const categoryData = rawCategoryData?.data || rawCategoryData;
  console.log('EditarCategoria - categoryData extraído:', categoryData);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    idadeMinima: '',
    idadeMaxima: '',
    ativo: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    console.log('EditarCategoria - categoryData recebido:', categoryData);
    if (categoryData) {
      console.log('EditarCategoria - Category ID:', categoryData._id);
      console.log('EditarCategoria - Campo ativo:', categoryData.ativo);
      console.log('EditarCategoria - Tipo do campo ativo:', typeof categoryData.ativo);
      setFormData({
        nome: categoryData.nome || '',
        descricao: categoryData.descricao || '',
        idadeMinima: categoryData.idadeMinima || '',
        idadeMaxima: categoryData.idadeMaxima || '',
        ativo: categoryData.ativo !== undefined ? categoryData.ativo : true
      });
    }
  }, [categoryData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('handleSubmit - categoryData:', categoryData);
    console.log('handleSubmit - categoryData._id:', categoryData?._id);
    
    // Validar se temos o ID da categoria
    if (!categoryData || !categoryData._id) {
      setError('ID da categoria não encontrado. Por favor, volte e selecione a categoria novamente.');
      return;
    }
    
    // Validações
    if (!formData.nome.trim()) {
      setError('O nome da categoria é obrigatório');
      return;
    }

    if (formData.idadeMinima && formData.idadeMaxima) {
      if (parseInt(formData.idadeMinima) > parseInt(formData.idadeMaxima)) {
        setError('A idade mínima não pode ser maior que a idade máxima');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Atualizando categoria com ID:', categoryData._id);
      console.log('Dados do formData:', formData);
      console.log('Campo ativo sendo enviado:', formData.ativo);
      console.log('Tipo do campo ativo:', typeof formData.ativo);
      
      const response = await categoryService.update(categoryData._id, formData);
      
      console.log('Resposta do servidor:', response);
      
      showSuccessMessage('Categoria atualizada com sucesso!');
      
      setTimeout(() => {
        if (onNavigate) {
          // Redirecionar para a listagem de categorias após edição
          onNavigate('menu-categorias');
        }
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('visualizar-categoria', { categoryData });
    }
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Validar se categoryData existe
  if (!categoryData) {
    return (
      <div className="editar-categoria-container">
        <Header 
          activeNav="Categorias" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="main-content">
          <div className="error-state" style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Erro: Categoria não encontrada</h2>
            <p>Não foi possível carregar os dados da categoria.</p>
            <button 
              className="btn-submit" 
              onClick={() => onNavigate('menu-categorias')}
              style={{ marginTop: '20px' }}
            >
              Voltar para Menu de Categorias
            </button>
          </div>
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
            <h1 className="panel-title">Editar Categoria</h1>
            <div className="header-actions">
              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={loading}
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{
              color: '#ff6b7a',
              background: 'rgba(220, 53, 69, 0.15)',
              padding: '15px 20px',
              borderRadius: '10px',
              marginBottom: '25px',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <X size={20} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{
              color: '#4ade80',
              background: 'rgba(40, 167, 69, 0.15)',
              padding: '15px 20px',
              borderRadius: '10px',
              marginBottom: '25px',
              border: '1px solid rgba(40, 167, 69, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Informações da Categoria */}
            <div className="info-section" style={{marginBottom: '30px'}}>
              <h2 className="section-title">Informações da Categoria</h2>
              
              <div className="form-group">
                <label htmlFor="nome">
                  Nome da Categoria <span style={{color: '#ff6b7a'}}>*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Sub-15, Juvenil, etc."
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição da categoria..."
                  rows="4"
                  disabled={loading}
                  className="form-textarea"
                />
              </div>

              <div className="info-grid">
                <div className="form-group">
                  <label htmlFor="idadeMinima">Idade Mínima</label>
                  <input
                    type="number"
                    id="idadeMinima"
                    name="idadeMinima"
                    value={formData.idadeMinima}
                    onChange={handleInputChange}
                    placeholder="Ex: 13"
                    min="0"
                    max="100"
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="idadeMaxima">Idade Máxima</label>
                  <input
                    type="number"
                    id="idadeMaxima"
                    name="idadeMaxima"
                    value={formData.idadeMaxima}
                    onChange={handleInputChange}
                    placeholder="Ex: 15"
                    min="0"
                    max="100"
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span>Categoria ativa</span>
                </label>
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.9rem',
                  color: 'rgba(224, 224, 224, 0.7)',
                  marginBottom: 0
                }}>
                  Categorias inativas não aparecem nas listagens
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="header-actions" style={{
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '2px solid var(--border-color)',
              marginTop: '30px'
            }}>
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={handleBack}
                disabled={loading}
              >
                <X size={20} />
                Cancelar
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditarCategoria;
