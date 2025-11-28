import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import { categoryService, gameService } from '../../services/api';
import './VisualizarJogoAgendado.css';

const VisualizarJogoAgendado = ({ onLogout, onNavigate, gameData }) => {
  const [formData, setFormData] = useState({
    time1: '',
    time2: '',
    local: '',
    cidade: '',
    dataJogo: '',
    horario: '',
    tipo: '',
    cep: '',
    uf: '',
    categoria: '',
    juiz: '',
    observacoes: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    lineup: true
  });

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Carregar dados do jogo
  const loadGameData = async () => {
    if (!gameData?.id) {
      setError('ID do jogo não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await gameService.getById(gameData.id);
      if (response.success) {
        const currentGame = response.data;
        
        setFormData({
          time1: currentGame.time1 || '',
          time2: currentGame.time2 || '',
          dataJogo: currentGame.dataJogo ? formatDateForInput(currentGame.dataJogo) : '',
          horario: currentGame.horario || '',
          local: currentGame.local || '',
          cep: currentGame.cep || '',
          cidade: currentGame.cidade || '',
          uf: currentGame.uf || '',
          tipo: currentGame.tipo || '',
          categoria: currentGame.categoria || '',
          juiz: currentGame.juiz || '',
          observacoes: currentGame.observacoes || ''
        });

        // Carregar escalação com posições
        const escalacao = currentGame.escalacao || [];
        setSelectedStudents(escalacao.map(student => ({
          ...student,
          posicao: student.posicao || ''
        })));
      } else {
        setError('Erro ao carregar dados do jogo');
      }
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
      setError('Erro ao carregar jogo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar categorias
  const loadCategorias = async () => {
    try {
      const response = await categoryService.getAll({ 
        ativo: true, 
        includeStudentCount: false 
      });
      setCategorias(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Carregar alunos por categoria
  const loadStudentsByCategory = async (categoria) => {
    if (!categoria) {
      setAvailableStudents([]);
      return;
    }

    try {
      setLoading(true);
      const response = await gameService.getStudentsByCategory(categoria);
      if (response.success) {
        setAvailableStudents(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setError('Erro ao carregar alunos da categoria');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
    loadGameData();
  }, []);

  // Funções para gerenciar escalação
  const addStudentToLineup = (student) => {
    if (!selectedStudents.find(s => s._id === student._id)) {
      setSelectedStudents([...selectedStudents, { ...student, posicao: '' }]);
    }
  };

  const removeStudentFromLineup = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => s._id !== studentId));
  };

  const updateStudentPosition = (studentId, posicao) => {
    setSelectedStudents(selectedStudents.map(s => 
      s._id === studentId ? { ...s, posicao } : s
    ));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Se mudou a categoria, carregar alunos dessa categoria
    if (field === 'categoria') {
      loadStudentsByCategory(value);
    }

    // Se mudou o CEP e tem 8 dígitos, buscar endereço
    if (field === 'cep') {
      const cepNumeros = value.replace(/\D/g, '');
      if (cepNumeros.length === 8) {
        buscarEnderecoPorCep(cepNumeros);
      }
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          cidade: data.localidade,
          uf: data.uf
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Preparar dados para envio
      const gameUpdateData = {
        time1: formData.time1,
        time2: formData.time2,
        dataJogo: formData.dataJogo,
        horario: formData.horario,
        local: formData.local,
        cep: formData.cep.replace(/\D/g, ''),
        cidade: formData.cidade,
        uf: formData.uf.toUpperCase(),
        tipo: formData.tipo,
        categoria: formData.categoria,
        juiz: formData.juiz,
        observacoes: formData.observacoes || '',
        escalacao: selectedStudents.map(student => ({
          _id: student._id,
          posicao: student.posicao
        }))
      };

      const response = await gameService.update(gameData.id, gameUpdateData);
      
      if (response.success) {
        alert('Jogo atualizado com sucesso!');
        
        // Voltar para menu de jogos
        if (onNavigate) {
          onNavigate('jogos-menu');
        }
      } else {
        throw new Error(response.message || 'Erro ao atualizar jogo');
      }
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
      setError(`Erro ao atualizar jogo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o jogo entre ${formData.time1} e ${formData.time2}?`)) {
      try {
        setLoading(true);
        const response = await gameService.delete(gameData.id);
        
        if (response.success) {
          alert('Jogo excluído com sucesso!');
          if (onNavigate) {
            onNavigate('jogos-menu');
          }
        } else {
          throw new Error(response.message || 'Erro ao excluir jogo');
        }
      } catch (error) {
        console.error('Erro ao excluir jogo:', error);
        alert(`Erro ao excluir jogo: ${error.message}`);
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <div className="student-search-container">
        <Header 
          activeNav="Jogos" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando dados do jogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Jogos" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <GamesSidebar 
          activeItem="Visualizar Jogo" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Editar Jogo</h1>
          
          {error && (
            <div className="error-message" style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid #f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 5px'
                }}
              >
                ×
              </button>
            </div>
          )}
          
          <div className="form-container">
            <form onSubmit={handleSubmit} className="game-form">
            {/* Seção de Detalhes do Jogo */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('details')}
              >
                Detalhes do Jogo
                {expandedSections.details ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.details && (
                <div className="section-content">
                  <div className="form-row">
                <div className="form-group">
                  <label htmlFor="time1">Time 1 *</label>
                  <input
                    id="time1"
                    type="text"
                    value={formData.time1}
                    onChange={(e) => handleInputChange('time1', e.target.value)}
                    placeholder="Nome do time 1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time2">Time 2 *</label>
                  <input
                    id="time2"
                    type="text"
                    value={formData.time2}
                    onChange={(e) => handleInputChange('time2', e.target.value)}
                    placeholder="Nome do time 2"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="local">Local *</label>
                  <input
                    id="local"
                    type="text"
                    value={formData.local}
                    onChange={(e) => handleInputChange('local', e.target.value)}
                    placeholder="Local do jogo"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="data">Data *</label>
                  <input
                    id="data"
                    type="date"
                    value={formData.dataJogo}
                    onChange={(e) => handleInputChange('dataJogo', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horario">Horário *</label>
                  <input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => handleInputChange('horario', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="categoria">Categoria *</label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">
                      {categorias.length === 0 ? 'Carregando categorias...' : 'Selecione uma categoria'}
                    </option>
                    {categorias.map((categoria) => (
                      <option key={categoria._id} value={categoria.nome}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cep">CEP *</label>
                  <input
                    id="cep"
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    placeholder="00000-000"
                    maxLength="9"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cidade">Cidade *</label>
                  <input
                    id="cidade"
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="Cidade"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="uf">UF *</label>
                  <input
                    id="uf"
                    type="text"
                    value={formData.uf}
                    onChange={(e) => handleInputChange('uf', e.target.value.toUpperCase())}
                    placeholder="SC"
                    maxLength="2"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipo">Tipo do Jogo *</label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="amistoso">Amistoso</option>
                    <option value="campeonato">Campeonato</option>
                    <option value="torneio">Torneio</option>
                    <option value="copa">Copa</option>
                    <option value="festival">Festival</option>
                    <option value="treino">Treino</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="juiz">Juiz *</label>
                  <input
                    id="juiz"
                    type="text"
                    value={formData.juiz}
                    onChange={(e) => handleInputChange('juiz', e.target.value)}
                    placeholder="Nome do juiz"
                    className="form-input"
                    required
                  />
                </div>
              </div>
                
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Observações sobre o jogo (opcional)"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>
                </div>
              )}
            </div>

            {/* Seção de Escalação */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('lineup')}
              >
                Escalação ({selectedStudents.length} jogadores)
                {expandedSections.lineup ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.lineup && (
                <div className="section-content">
                  {!formData.categoria ? (
                    <div className="info-message">
                      <p>⚠️ Selecione uma categoria primeiro para ver os alunos disponíveis</p>
                    </div>
                  ) : (
                    <>
                      {/* Alunos selecionados */}
                      {selectedStudents.length > 0 && (
                        <div className="selected-students">
                          <h3>Jogadores Selecionados:</h3>
                          <div className="selected-students-grid">
                            {selectedStudents.map((student) => (
                              <div key={student._id} className="selected-student-card">
                                <div className="student-info">
                                  <span className="student-name">{student.nomeAluno}</span>
                                  <span className="student-details">
                                    {student.genero} • {new Date().getFullYear() - new Date(student.dataNascimento).getFullYear()} anos
                                  </span>
                                </div>
                                <div className="student-position">
                                  <select
                                    value={student.posicao || ''}
                                    onChange={(e) => updateStudentPosition(student._id, e.target.value)}
                                    className="position-select"
                                  >
                                    <option value="">Posição</option>
                                    <option value="goleiro">Goleiro</option>
                                    <option value="zagueiro">Zagueiro</option>
                                    <option value="lateral-direito">Lateral Direito</option>
                                    <option value="lateral-esquerdo">Lateral Esquerdo</option>
                                    <option value="volante">Volante</option>
                                    <option value="meia">Meia</option>
                                    <option value="meia-atacante">Meia Atacante</option>
                                    <option value="ponta-direita">Ponta Direita</option>
                                    <option value="ponta-esquerda">Ponta Esquerda</option>
                                    <option value="atacante">Atacante</option>
                                    <option value="centroavante">Centroavante</option>
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  className="remove-student-btn"
                                  onClick={() => removeStudentFromLineup(student._id)}
                                  title="Remover jogador"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lista de alunos disponíveis */}
                      <div className="available-students">
                        <h3>Alunos Disponíveis - {formData.categoria}:</h3>
                        {availableStudents.length === 0 ? (
                          <p className="no-students">Nenhum aluno encontrado nesta categoria</p>
                        ) : (
                          <div className="students-list">
                            {availableStudents
                              .filter(student => !selectedStudents.find(s => s._id === student._id))
                              .map((student) => (
                                <div key={student._id} className="student-list-item">
                                  <div className="student-list-info">
                                    <span className="student-name">{student.nomeAluno}</span>
                                    <span className="student-details">
                                      {student.genero} • {new Date().getFullYear() - new Date(student.dataNascimento).getFullYear()} anos • {student.telefone}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="add-student-btn"
                                    onClick={() => addStudentToLineup(student)}
                                  >
                                    Adicionar
                                  </button>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="action-buttons">
              <button type="submit" className="action-btn-jogo salvar-btn">
                <Save size={16} />
                SALVAR ALTERAÇÕES
              </button>
              <button type="button" className="action-btn-jogo cancelar-btn" onClick={handleBack}>
                <X size={16} />
                CANCELAR
              </button>
              <button 
                type="button" 
                className="action-btn-jogo"
                onClick={handleDelete}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
                }}
              >
                🗑️ EXCLUIR JOGO
              </button>
            </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualizarJogoAgendado;
