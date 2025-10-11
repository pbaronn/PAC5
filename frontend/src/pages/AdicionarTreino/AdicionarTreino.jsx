import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Save, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import TreinosSidebar from '../../components/TreinosSidebar/TreinosSidebar';
import './AdicionarTreino.css';

const AdicionarTreino = ({ onLogout, onNavigate }) => {
  const [formData, setFormData] = useState({
    categoria: '',
    diasSemana: [],
    horarioInicio: '',
    horarioFim: '',
    local: '',
    tecnico: ''
  });

  const diasSemanaOptions = [
    'Segunda-feira',
    'Terça-feira', 
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  const categoriaOptions = [
    'Sub-8',
    'Sub-10',
    'Sub-12',
    'Sub-14',
    'Sub-16',
    'Sub-18',
    'Sub-20',
    'Adulto'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiasSemanaChange = (dia) => {
    setFormData(prev => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Treino:', formData);
    
    // Simular salvamento
    const message = document.createElement('div');
    message.innerText = 'Treino cadastrado com sucesso!';
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
      // Redirecionar para a página de treinos
      if (onNavigate) {
        onNavigate('treinos');
      }
    }, 2000);
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

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Treinos" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <TreinosSidebar 
          activeItem="Adicionar Treino" 
          onItemClick={handleSidebarClick}
          showBackButton={true}
          onBackClick={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Adicionar Treino</h1>
          
          <form className="treino-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Categoria */}
              <div className="form-field">
                <label className="field-label">
                  <User size={18} />
                  Categoria
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriaOptions.map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dias da Semana */}
              <div className="form-field full-width">
                <label className="field-label">
                  <Calendar size={18} />
                  Dias da Semana
                </label>
                <div className="checkbox-group">
                  {diasSemanaOptions.map(dia => (
                    <label key={dia} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.diasSemana.includes(dia)}
                        onChange={() => handleDiasSemanaChange(dia)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">{dia}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Horário de Início */}
              <div className="form-field">
                <label className="field-label">
                  <Clock size={18} />
                  Horário de Início
                </label>
                <input
                  type="time"
                  name="horarioInicio"
                  value={formData.horarioInicio}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                />
              </div>

              {/* Horário de Fim */}
              <div className="form-field">
                <label className="field-label">
                  <Clock size={18} />
                  Horário de Fim
                </label>
                <input
                  type="time"
                  name="horarioFim"
                  value={formData.horarioFim}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                />
              </div>

              {/* Local */}
              <div className="form-field">
                <label className="field-label">
                  <MapPin size={18} />
                  Local
                </label>
                <input
                  type="text"
                  name="local"
                  value={formData.local}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Ex: Campo Principal"
                  required
                />
              </div>

              {/* Técnico */}
              <div className="form-field">
                <label className="field-label">
                  <User size={18} />
                  Técnico Responsável
                </label>
                <input
                  type="text"
                  name="tecnico"
                  value={formData.tecnico}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Nome do técnico"
                  required
                />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleBack}>
                Cancelar
              </button>
              <button type="submit" className="save-button">
                <Save size={20} />
                <span>Salvar Treino</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdicionarTreino;
