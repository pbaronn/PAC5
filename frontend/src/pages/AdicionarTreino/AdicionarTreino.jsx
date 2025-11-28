import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Save, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import TreinosSidebar from '../../components/TreinosSidebar/TreinosSidebar';
import { treinoService, categoryService } from '../../services/api';
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
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll({ ativo: true });
      console.log('Categorias carregadas:', response);
      if (response.success && response.data) {
        setCategorias(response.data);
        console.log('Total de categorias:', response.data.length);
      } else {
        setCategorias([]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setError('Erro ao carregar categorias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
    setLoading(true);
    setError('');
    
    treinoService.create(formData)
      .then(response => {
        // Mostrar mensagem de sucesso
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
          if (onNavigate) {
            onNavigate('treinos');
          }
        }, 2000);
      })
      .catch(error => {
        console.error('Erro ao cadastrar treino:', error);
        setError(error.message || 'Erro ao cadastrar treino');
      })
      .finally(() => {
        setLoading(false);
      });
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
                  {categorias.map(categoria => (
                    <option key={categoria._id} value={categoria.nome}>
                      {categoria.nome}
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
              <button type="button" className="cancel-button" onClick={handleBack} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="save-button" disabled={loading}>
                <Save size={20} />
                <span>{loading ? 'Salvando...' : 'Salvar Treino'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdicionarTreino;
