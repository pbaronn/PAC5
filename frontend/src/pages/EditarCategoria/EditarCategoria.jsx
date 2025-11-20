import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService } from '../../services/api';
import './EditarCategoria.css';

const EditarCategoria = ({ onLogout, onNavigate, categoryData }) => {
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
    if (categoryData) {
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

      await categoryService.update(categoryData._id, formData);
      
      showSuccessMessage('Categoria atualizada com sucesso!');
      
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('visualizar-categoria', { categoryData: { ...categoryData, ...formData } });
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

  return (
    <div className="editar-categoria-container">
      <Header 
        activeNav="Categorias" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <CategoriesSidebar 
          activeItem="visualizar" 
          onNavigate={handleSidebarClick}
        />
        
        <div className="content-area">
          <div className="page-header">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
              Voltar
            </button>
            <h1>Editar Categoria</h1>
          </div>

          {error && (
            <div className="error-message">
              <X size={20} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="categoria-form">
            <div className="form-section">
              <h2>Informações da Categoria</h2>
              
              <div className="form-group">
                <label htmlFor="nome">
                  Nome da Categoria <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Sub-15, Juvenil, etc."
                  required
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
                />
              </div>

              <div className="form-row">
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
                  />
                  <span>Categoria ativa</span>
                </label>
                <p className="field-hint">
                  Categorias inativas não aparecem nas listagens
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleBack}
                disabled={loading}
              >
                <X size={20} />
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarCategoria;
