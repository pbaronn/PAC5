import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, User, Edit, Save, XCircle, Trash2 } from 'lucide-react';
import Header from '../../components/Header/Header';
import TreinosSidebar from '../../components/TreinosSidebar/TreinosSidebar';
import './VisualizarTreino.css';

const VisualizarTreino = ({ onLogout, onNavigate, treinoData }) => {
  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    categoria: '',
    diasSemana: [],
    horarioInicio: '',
    horarioFim: '',
    local: '',
    tecnico: ''
  });

  // Dados mockados para o treino
  const mockTreinoData = {
    id: 1,
    categoria: 'Sub-12',
    diasSemana: ['Segunda', 'Quarta', 'Sexta'],
    horarioInicio: '14:00',
    horarioFim: '15:30',
    local: 'Campo Principal',
    tecnico: 'João Silva'
  };

  // Opções para dias da semana
  const diasSemanaOptions = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      const currentTreino = treinoData || mockTreinoData;
      setTreino(currentTreino);
      setFormData({
        categoria: currentTreino.categoria || '',
        diasSemana: currentTreino.diasSemana || [],
        horarioInicio: currentTreino.horarioInicio || '',
        horarioFim: currentTreino.horarioFim || '',
        local: currentTreino.local || '',
        tecnico: currentTreino.tecnico || ''
      });
      setLoading(false);
    }, 500);
  }, [treinoData]);

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

  const handleSave = () => {
    if (!formData.categoria.trim()) {
      alert('Por favor, insira a categoria do treino.');
      return;
    }

    if (formData.diasSemana.length === 0) {
      alert('Por favor, selecione pelo menos um dia da semana.');
      return;
    }

    if (!formData.horarioInicio || !formData.horarioFim) {
      alert('Por favor, preencha os horários de início e fim.');
      return;
    }

    const updatedTreino = {
      ...treino,
      ...formData
    };

    console.log('Treino atualizado:', updatedTreino);
    alert('Treino atualizado com sucesso!');
    
    setTreino(updatedTreino);
    setEditMode(false);
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

  const handleDeleteTreino = () => {
    if (window.confirm(`Tem certeza que deseja excluir o treino da categoria "${treino?.categoria}"? Esta ação não pode ser desfeita.`)) {
      console.log('Excluindo treino:', treino);
      alert('Treino excluído com sucesso!');
      // Volta para a lista de treinos após excluir
      if (onNavigate) {
        onNavigate('treinos');
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
            
            <div className="view-actions">
              {!editMode ? (
                <div className="view-mode-actions">
                  <button 
                    className="edit-btn"
                    onClick={handleEditToggle}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={handleDeleteTreino}
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
                  >
                    <Save size={18} />
                    Salvar
                  </button>
                  <button 
                    className="cancel-edit-btn"
                    onClick={handleCancelEdit}
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
