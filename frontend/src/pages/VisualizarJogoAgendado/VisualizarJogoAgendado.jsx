import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import './VisualizarJogoAgendado.css';

const VisualizarJogoAgendado = ({ onLogout, onNavigate, gameData }) => {
  const [game, setGame] = useState(null);
  const [lineup, setLineup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Dados mockados para o jogo
  const mockGameData = {
    id: 1,
    homeTeam: 'JEC',
    awayTeam: 'São Paulo FC',
    date: '15/06/2025',
    time: '15:00',
    location: 'Campo Principal',
    cep: '01234-567',
    city: 'São Paulo',
    state: 'SP',
    type: 'Amistoso',
    category: 'Sub-7',
    referee: 'João Silva'
  };

  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    location: '',
    cep: '',
    city: '',
    state: '',
    type: '',
    category: '',
    referee: ''
  });

  const [lineupData, setLineupData] = useState([]);

  // Dados mockados para a escalação
  const mockLineup = [
    { id: 1, name: 'João Pedro Silva', category: 'Atacante' },
    { id: 2, name: 'Maria Santos Oliveira', category: 'Meio-campo' },
    { id: 3, name: 'Pedro Costa Lima', category: 'Zagueiro' },
    { id: 4, name: 'Ana Beatriz Ferreira', category: 'Goleiro' },
    { id: 5, name: 'Lucas Rodrigues', category: 'Lateral' },
    { id: 6, name: 'Sofia Almeida', category: 'Atacante' }
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      const currentGame = gameData || mockGameData;
      setGame(currentGame);
      setLineup(mockLineup);
      
      // Preenche o formulário com os dados do jogo
      setFormData({
        homeTeam: currentGame.homeTeam || '',
        awayTeam: currentGame.awayTeam || '',
        date: currentGame.date || '',
        time: currentGame.time || '',
        location: currentGame.location || '',
        cep: currentGame.cep || '',
        city: currentGame.city || '',
        state: currentGame.state || '',
        type: currentGame.type || '',
        category: currentGame.category || '',
        referee: currentGame.referee || ''
      });

      // Preenche a escalação
      setLineupData(mockLineup);
      
      setLoading(false);
    }, 500);
  }, [gameData]);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineupChange = (index, field, value) => {
    const newLineup = [...lineupData];
    newLineup[index] = {
      ...newLineup[index],
      [field]: value
    };
    setLineupData(newLineup);
  };

  const addLineupPlayer = () => {
    setLineupData([...lineupData, { id: Date.now(), name: '', category: '' }]);
  };

  const removeLineupPlayer = (index) => {
    if (lineupData.length > 1) {
      const newLineup = lineupData.filter((_, i) => i !== index);
      setLineupData(newLineup);
    }
  };

  const handleEditToggle = () => {
    if (!editMode) {
      // Ao entrar no modo de edição, mantém os dados atuais
      setFormData({
        homeTeam: game?.homeTeam || '',
        awayTeam: game?.awayTeam || '',
        date: game?.date || '',
        time: game?.time || '',
        location: game?.location || '',
        cep: game?.cep || '',
        city: game?.city || '',
        state: game?.state || '',
        type: game?.type || '',
        category: game?.category || '',
        referee: game?.referee || ''
      });
      setLineupData(mockLineup);
    }
    setEditMode(!editMode);
  };

  const handleSave = () => {
    console.log('Dados do jogo atualizados:', formData);
    console.log('Escalação atualizada:', lineupData);
    
    // Aqui você implementaria a lógica de salvamento
    alert('Jogo atualizado com sucesso!');
    
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    // Restaura os dados originais
    setFormData({
      homeTeam: game?.homeTeam || '',
      awayTeam: game?.awayTeam || '',
      date: game?.date || '',
      time: game?.time || '',
      location: game?.location || '',
      cep: game?.cep || '',
      city: game?.city || '',
      state: game?.state || '',
      type: game?.type || '',
      category: game?.category || '',
      referee: game?.referee || ''
    });

    // Restaura a escalação original
    setLineupData(mockLineup);
    
    setEditMode(false);
  };

  const handleDeleteGame = () => {
    if (window.confirm(`Tem certeza que deseja excluir o jogo entre ${game?.homeTeam} e ${game?.awayTeam}? Esta ação não pode ser desfeita.`)) {
      console.log('Excluindo jogo:', game);
      
      // Aqui você implementaria a lógica de exclusão
      alert('Jogo excluído com sucesso!');
      
      // Volta para o menu de jogos após excluir
      if (onNavigate) {
        onNavigate('jogos-menu');
      }
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
          <div className="view-header">
            <h1 className="panel-title">
              {editMode ? 'Editando Jogo Agendado' : 'Visualizar Jogo Agendado'}
            </h1>
            
            <div className="view-actions">
              {!editMode ? (
                <div className="view-mode-actions">
                  <button 
                    type="button" 
                    className="edit-btn"
                    onClick={handleEditToggle}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={handleDeleteGame}
                  >
                    🗑️ Excluir Jogo
                  </button>
                </div>
              ) : (
                <div className="edit-actions">
                  <button 
                    type="button" 
                    className="save-btn"
                    onClick={handleSave}
                  >
                    💾 Salvar
                  </button>
                  <button 
                    type="button" 
                    className="cancel-edit-btn"
                    onClick={handleCancelEdit}
                  >
                    ✖️ Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Seção de Detalhes do Jogo */}
          <div className="form-section">
            <h2 className="section-title">Detalhes do Jogo</h2>
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Time 1</label>
                  <input 
                    type="text" 
                    value={formData.homeTeam} 
                    onChange={(e) => handleInputChange('homeTeam', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Time 2</label>
                  <input 
                    type="text" 
                    value={formData.awayTeam} 
                    onChange={(e) => handleInputChange('awayTeam', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Data</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Horário</label>
                  <input 
                    type="time" 
                    value={formData.time} 
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Local</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>CEP:</label>
                  <input 
                    type="text" 
                    value={formData.cep} 
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>UF:</label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo:</label>
                  <input 
                    type="text" 
                    value={formData.type} 
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Juiz:</label>
                  <input 
                    type="text" 
                    value={formData.referee} 
                    onChange={(e) => handleInputChange('referee', e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Escalação */}
          <div className="form-section">
            <h2 className="section-title">Escalação</h2>
            <div className="section-content">
              {lineupData.map((player, index) => (
                <div key={player.id} className="lineup-row">
                  <div className="form-group">
                    <label>Nome</label>
                    <input 
                      type="text" 
                      value={player.name} 
                      onChange={(e) => handleLineupChange(index, 'name', e.target.value)}
                      readOnly={!editMode}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoria</label>
                    <input 
                      type="text" 
                      value={player.category} 
                      onChange={(e) => handleLineupChange(index, 'category', e.target.value)}
                      readOnly={!editMode}
                      className="form-input"
                    />
                  </div>
                  {editMode && lineupData.length > 1 && (
                    <button
                      type="button"
                      className="remove-player-btn"
                      onClick={() => removeLineupPlayer(index)}
                      title="Remover jogador"
                    >
                      ✖️
                    </button>
                  )}
                </div>
              ))}
              
              {editMode && (
                <button
                  type="button"
                  className="add-player-btn"
                  onClick={addLineupPlayer}
                >
                  ➕ Adicionar Jogador
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualizarJogoAgendado;
