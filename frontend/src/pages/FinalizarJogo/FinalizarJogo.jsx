import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import './FinalizarJogo.css';

const FinalizarJogo = ({ onLogout, onNavigate, gameData }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    time1Name: '',
    time1Score: '',
    time2Score: '',
    time2Name: '',
    acrescimo: 'nao',
    tempoAcrescimo: '',
    observacoes: ''
  });

  // Dados mockados para o jogo
  const mockGameData = {
    id: 1,
    homeTeam: 'JEC',
    awayTeam: 'São Paulo FC',
    date: '15/06/2025',
    time: '15:00',
    category: 'Sub-7'
  };

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      const currentGame = gameData || mockGameData;
      setGame(currentGame);
      
      // Preenche os nomes dos times automaticamente
      setFormData(prev => ({
        ...prev,
        time1Name: currentGame.homeTeam || '',
        time2Name: currentGame.awayTeam || ''
      }));
      
      setLoading(false);
    }, 500);
  }, [gameData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do jogo finalizado:', formData);
    
    // Aqui você implementaria a lógica de salvamento
    alert('Jogo finalizado com sucesso!');
    
    // Volta para o menu de jogos após salvar
    if (onNavigate) {
      onNavigate('jogos-menu');
    }
  };

  const handleCancel = () => {
    if (onNavigate) {
      onNavigate('jogos-menu');
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
          activeItem="Finalizar Jogo" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Finalizar Jogo</h1>
          
          <form onSubmit={handleSubmit} className="finalizar-form">
            {/* Seção de Placar */}
            <div className="form-section">
              <h2 className="section-title">Placar</h2>
              <div className="section-content">
                <div className="placar-container">
                  <div className="placar-field">
                    <input
                      type="text"
                      value={formData.time1Name}
                      onChange={(e) => handleInputChange('time1Name', e.target.value)}
                      placeholder="Time 1"
                      className="team-input"
                    />
                  </div>
                  <div className="placar-field">
                    <input
                      type="number"
                      value={formData.time1Score}
                      onChange={(e) => handleInputChange('time1Score', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="score-input"
                    />
                  </div>
                  <div className="placar-field">
                    <input
                      type="number"
                      value={formData.time2Score}
                      onChange={(e) => handleInputChange('time2Score', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="score-input"
                    />
                  </div>
                  <div className="placar-field">
                    <input
                      type="text"
                      value={formData.time2Name}
                      onChange={(e) => handleInputChange('time2Name', e.target.value)}
                      placeholder="Time 2"
                      className="team-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Acréscimo */}
            <div className="form-section">
              <h2 className="section-title">Acréscimo</h2>
              <div className="section-content">
                <div className="acrescimo-container">
                  <button
                    type="button"
                    className={`acrescimo-btn ${formData.acrescimo === 'sim' ? 'active' : ''}`}
                    onClick={() => handleInputChange('acrescimo', 'sim')}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    className={`acrescimo-btn ${formData.acrescimo === 'nao' ? 'active' : ''}`}
                    onClick={() => handleInputChange('acrescimo', 'nao')}
                  >
                    Não
                  </button>
                </div>
                
                {formData.acrescimo === 'sim' && (
                  <div className="tempo-acrescimo-container">
                    <label htmlFor="tempoAcrescimo" className="tempo-label">
                      Tempo de acréscimo (minutos):
                    </label>
                    <input
                      id="tempoAcrescimo"
                      type="number"
                      value={formData.tempoAcrescimo}
                      onChange={(e) => handleInputChange('tempoAcrescimo', e.target.value)}
                      placeholder="Ex: 5"
                      min="1"
                      max="30"
                      className="tempo-input"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Seção de Observações */}
            <div className="form-section">
              <h2 className="section-title">Observações</h2>
              <div className="section-content">
                <div className="observacoes-container">
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Digite suas observações sobre o jogo..."
                    className="observacoes-textarea"
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="action-buttons">
              <button type="submit" className="action-btn salvar-btn">
                Salvar
              </button>
              <button type="button" className="action-btn cancelar-btn" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default FinalizarJogo;
