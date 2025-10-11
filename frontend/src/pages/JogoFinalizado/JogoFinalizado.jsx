import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import './JogoFinalizado.css';

const JogoFinalizado = ({ onLogout, onNavigate, gameData }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    time1: '',
    time2: '',
    date: '',
    time: '',
    id: '',
    local: '',
    cep: '',
    cidade: '',
    uf: '',
    tipo: '',
    categoria: '',
    acrescimo: '',
    juiz: '',
    placarTime1: '',
    placarTime2: '',
    observacao: ''
  });

  const [lineup, setLineup] = useState([
    { nome: '', categoria: '' },
    { nome: '', categoria: '' },
    { nome: '', categoria: '' }
  ]);

  const [expandedSections, setExpandedSections] = useState({
    jogo: true,
    observacao: true,
    escalacao: true
  });

  // Dados mockados para o jogo finalizado
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
    referee: 'João Silva',
    score1: 2,
    score2: 1,
    extraTime: '5 minutos',
    observation: 'Jogo muito disputado com boa atuação de ambos os times.'
  };

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      const currentGame = gameData || mockGameData;
      setGame(currentGame);
      
      // Preenche o formulário com os dados do jogo
      setFormData({
        time1: currentGame.homeTeam || '',
        time2: currentGame.awayTeam || '',
        date: currentGame.date || '',
        time: currentGame.time || '',
        id: currentGame.id || '',
        local: currentGame.location || '',
        cep: currentGame.cep || '',
        cidade: currentGame.city || '',
        uf: currentGame.state || '',
        tipo: currentGame.type || '',
        categoria: currentGame.category || '',
        acrescimo: currentGame.extraTime || '',
        juiz: currentGame.referee || '',
        placarTime1: currentGame.score1 || '',
        placarTime2: currentGame.score2 || '',
        observacao: currentGame.observation || ''
      });

      // Preenche a escalação
      setLineup([
        { nome: 'João Pedro Silva', categoria: 'Atacante' },
        { nome: 'Maria Santos Oliveira', categoria: 'Meio-campo' },
        { nome: 'Pedro Costa Lima', categoria: 'Zagueiro' }
      ]);
      
      setLoading(false);
    }, 500);
  }, [gameData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineupChange = (index, field, value) => {
    const newLineup = [...lineup];
    newLineup[index] = {
      ...newLineup[index],
      [field]: value
    };
    setLineup(newLineup);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
          activeItem="Jogo Finalizado" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Jogo Finalizado</h1>
          
          <div className="form-container">
            {/* Seção Jogo */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('jogo')}
              >
                Jogo
                {expandedSections.jogo ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.jogo && (
                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Time 1</label>
                      <input
                        type="text"
                        value={formData.time1}
                        onChange={(e) => handleInputChange('time1', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time 2</label>
                      <input
                        type="text"
                        value={formData.time2}
                        onChange={(e) => handleInputChange('time2', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Data</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Horário</label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>ID</label>
                      <input
                        type="text"
                        value={formData.id}
                        onChange={(e) => handleInputChange('id', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group wide">
                      <label>Local</label>
                      <input
                        type="text"
                        value={formData.local}
                        onChange={(e) => handleInputChange('local', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>CEP:</label>
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group wide">
                      <label>Cidade</label>
                      <input
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>UF:</label>
                      <input
                        type="text"
                        value={formData.uf}
                        onChange={(e) => handleInputChange('uf', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo:</label>
                      <input
                        type="text"
                        value={formData.tipo}
                        onChange={(e) => handleInputChange('tipo', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Categoria</label>
                      <input
                        type="text"
                        value={formData.categoria}
                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Acréscimo</label>
                      <input
                        type="text"
                        value={formData.acrescimo}
                        onChange={(e) => handleInputChange('acrescimo', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Juiz:</label>
                      <input
                        type="text"
                        value={formData.juiz}
                        onChange={(e) => handleInputChange('juiz', e.target.value)}
                        readOnly
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Placar</label>
                      <div className="placar-container">
                        <input
                          type="text"
                          value={formData.time1}
                          onChange={(e) => handleInputChange('time1', e.target.value)}
                          readOnly
                          className="placar-team-input"
                        />
                        <input
                          type="text"
                          value={formData.placarTime1}
                          onChange={(e) => handleInputChange('placarTime1', e.target.value)}
                          readOnly
                          className="placar-input"
                        />
                        <span className="placar-separator">x</span>
                        <input
                          type="text"
                          value={formData.placarTime2}
                          onChange={(e) => handleInputChange('placarTime2', e.target.value)}
                          readOnly
                          className="placar-input"
                        />
                        <input
                          type="text"
                          value={formData.time2}
                          onChange={(e) => handleInputChange('time2', e.target.value)}
                          readOnly
                          className="placar-team-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Seção Observação */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('observacao')}
              >
                Observação
                {expandedSections.observacao ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.observacao && (
                <div className="section-content">
                  <div className="observacao-container">
                    <textarea
                      value={formData.observacao}
                      onChange={(e) => handleInputChange('observacao', e.target.value)}
                      readOnly
                      className="observacao-textarea"
                      rows={6}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Seção Escalação */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('escalacao')}
              >
                Escalação
                {expandedSections.escalacao ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.escalacao && (
                <div className="section-content">
                  {lineup.map((player, index) => (
                    <div key={index} className="lineup-row">
                      <div className="form-group">
                        <label>Nome</label>
                        <input
                          type="text"
                          value={player.nome}
                          onChange={(e) => handleLineupChange(index, 'nome', e.target.value)}
                          readOnly
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Categoria</label>
                        <input
                          type="text"
                          value={player.categoria}
                          onChange={(e) => handleLineupChange(index, 'categoria', e.target.value)}
                          readOnly
                          className="form-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JogoFinalizado;
