import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, User, Edit, Save, XCircle, Trash2 } from 'lucide-react';
import Header from '../../components/Header/Header';
import TreinosSidebar from '../../components/TreinosSidebar/TreinosSidebar';
import { treinoService } from '../../services/api';
import './VisualizarTreino.css';

const VisualizarTreino = ({ onLogout, onNavigate, treinoData }) => {
  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    categoria: '',
    diasSemana: [],
    horarioInicio: '',
    horarioFim: '',
    local: '',
    tecnico: ''
  });

  // Opções para dias da semana
  const diasSemanaOptions = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];

  useEffect(() => {
    loadTreino();
  }, [treinoData]);

  const loadTreino = async () => {
    try {
      setLoading(true);
      if (treinoData && treinoData._id) {
        const response = await treinoService.getById(treinoData._id);
        const currentTreino = response.data;
        setTreino(currentTreino);
        setFormData({
          categoria: currentTreino.categoria || '',
          diasSemana: currentTreino.diasSemana || [],
          horarioInicio: currentTreino.horarioInicio || '',
          horarioFim: currentTreino.horarioFim || '',
          local: currentTreino.local || '',
          tecnico: currentTreino.tecnico || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar treino:', error);
      setError('Erro ao carregar treino');
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('treinos');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiasSemanaChange = (dia, checked) => {
    setFormData(prev => ({
      ...prev,
      diasSemana: checked 
        ? [...prev.diasSemana, dia]
        : prev.diasSemana.filter(d => d !== dia)
    }));
  };

  const handleEditToggle = () => {
    if (!editMode) {
      // Ao entrar no modo de edição, mantém os dados atuais
      setFormData({
        categoria: treino?.categoria || '',
        diasSemana: treino?.diasSemana || [],
        horarioInicio: treino?.horarioInicio || '',
        horarioFim: treino?.horarioFim || '',
        local: treino?.local || '',
        tecnico: treino?.tecnico || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    if (!formData.categoria.trim()) {
      setError('Por favor, insira a categoria do treino.');
      return;
    }

    if (formData.diasSemana.length === 0) {
      setError('Por favor, selecione pelo menos um dia da semana.');
      return;
    }

    if (!formData.horarioInicio || !formData.horarioFim) {
      setError('Por favor, preencha os horários de início e fim.');
      return;
    }

    try {
      setLoading(true);
      const response = await treinoService.update(treino._id, formData);
      setTreino(response.data);
      setEditMode(false);
      setError('');
      
      // Mostrar mensagem de sucesso
      const message = document.createElement('div');
      message.innerText = 'Treino atualizado com sucesso!';
      message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #000000;
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(message);
      setTimeout(() => {
        document.body.removeChild(message);
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      setError(error.message || 'Erro ao atualizar treino');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaura os dados originais
    setFormData({
      categoria: treino?.categoria || '',
      diasSemana: treino?.diasSemana || [],
      horarioInicio: treino?.horarioInicio || '',
      horarioFim: treino?.horarioFim || '',
      local: treino?.local || '',
      tecnico: treino?.tecnico || ''
    });
    setEditMode(false);
  };

  const handleDeleteTreino = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o treino da categoria "${treino?.categoria}"? Esta ação não pode ser desfeita.`)) {
      try {
        setLoading(true);
        await treinoService.delete(treino._id);
        
        // Mostrar mensagem de sucesso
        const message = document.createElement('div');
        message.innerText = 'Treino excluído com sucesso!';
        message.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #000000;
          color: white;
          padding: 20px 40px;
          border-radius: 10px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(message);
        setTimeout(() => {
          document.body.removeChild(message);
          if (onNavigate) {
            onNavigate('treinos');
          }
        }, 2000);
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
        setError(error.message || 'Erro ao excluir treino');
        setLoading(false);
      }
    }
  };

  const formatDiasSemana = (dias) => {
    return dias.join(', ');
  };

  const formatHorario = (inicio, fim) => {
    return `${inicio} - ${fim}`;
  };

  if (loading) {
    return (
      <div className="student-search-container">
        <Header 
          activeNav="Treinos" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando treino...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Treinos" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <TreinosSidebar 
          activeItem="Treinos Agendados" 
          onItemClick={handleSidebarClick}
        />
        
        <main className="main-panel">
          <div className="view-header">
            <h1 className="panel-title">Visualizar Treino</h1>
            
            {error && (
              <div style={{
                padding: '10px 15px',
                marginBottom: '20px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '5px',
                color: '#c33'
              }}>
                {error}
              </div>
            )}
            
            <div className="view-actions">
              {!editMode ? (
                <div className="view-mode-actions">
                  <button 
                    className="edit-btn"
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={handleDeleteTreino}
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                    Excluir Treino
                  </button>
                </div>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button 
                    className="cancel-edit-btn"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Informações do treino */}
          <div className="form-section">
            <h2 className="section-title">Informações do Treino</h2>
            
            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>
              <input
                id="categoria"
                type="text"
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                readOnly={!editMode}
                className="form-input"
                placeholder="Ex: Sub-12"
              />
            </div>

            <div className="form-group">
              <label>Dias da Semana</label>
              {editMode ? (
                <div className="checkbox-group">
                  {diasSemanaOptions.map((dia) => (
                    <label key={dia} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.diasSemana.includes(dia)}
                        onChange={(e) => handleDiasSemanaChange(dia, e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">{dia}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="readonly-field">
                  {formatDiasSemana(formData.diasSemana)}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="horarioInicio">Horário de Início</label>
                <input
                  id="horarioInicio"
                  type="time"
                  value={formData.horarioInicio}
                  onChange={(e) => handleInputChange('horarioInicio', e.target.value)}
                  readOnly={!editMode}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="horarioFim">Horário de Fim</label>
                <input
                  id="horarioFim"
                  type="time"
                  value={formData.horarioFim}
                  onChange={(e) => handleInputChange('horarioFim', e.target.value)}
                  readOnly={!editMode}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="local">Local</label>
              <input
                id="local"
                type="text"
                value={formData.local}
                onChange={(e) => handleInputChange('local', e.target.value)}
                readOnly={!editMode}
                className="form-input"
                placeholder="Ex: Campo Principal"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tecnico">Técnico</label>
              <input
                id="tecnico"
                type="text"
                value={formData.tecnico}
                onChange={(e) => handleInputChange('tecnico', e.target.value)}
                readOnly={!editMode}
                className="form-input"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualizarTreino;
