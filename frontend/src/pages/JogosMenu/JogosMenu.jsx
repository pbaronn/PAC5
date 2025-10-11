import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import './JogosMenu.css';

const JogosMenu = ({ onLogout, onNavigate }) => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [finalizingGames, setFinalizingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados fake para próximos jogos
  const mockUpcomingGames = [
    { 
      id: 1, 
      homeTeam: 'JEC', 
      awayTeam: 'São Paulo FC', 
      date: '15/06/2025',
      time: '15:00',
      category: 'Sub-7',
      location: 'Campo Principal'
    },
    { 
      id: 2, 
      homeTeam: 'JEC', 
      awayTeam: 'Palmeiras', 
      date: '29/07/2025',
      time: '16:30',
      category: 'Sub-8',
      location: 'Campo 2'
    },
    { 
      id: 3, 
      homeTeam: 'JEC', 
      awayTeam: 'Santos', 
      date: '15/06/2025',
      time: '14:00',
      category: 'Sub-6',
      location: 'Campo Principal'
    },
    { 
      id: 4, 
      homeTeam: 'JEC', 
      awayTeam: 'Corinthians', 
      date: '29/07/2025',
      time: '17:00',
      category: 'Sub-9',
      location: 'Campo 1'
    }
  ];

  // Dados mockados para jogos a finalizar
  const mockFinalizingGames = [
    { 
      id: 5, 
      homeTeam: 'JEC', 
      awayTeam: 'Flamengo', 
      date: '10/05/2025',
      time: '15:30',
      category: 'Sub-7',
      location: 'Campo Principal',
      status: 'Editar'
    },
    { 
      id: 6, 
      homeTeam: 'JEC', 
      awayTeam: 'Grêmio', 
      date: '25/05/2025',
      time: '16:00',
      category: 'Sub-8',
      location: 'Campo 2',
      status: 'Editar'
    },
    { 
      id: 7, 
      homeTeam: 'JEC', 
      awayTeam: 'Internacional', 
      date: '30/05/2025',
      time: '14:30',
      category: 'Sub-6',
      location: 'Campo Principal',
      status: 'Editar'
    }
  ];

  const fetchGames = async () => {
    setLoading(true);
    try {
      // Simula carregamento
      setTimeout(() => {
        setUpcomingGames(mockUpcomingGames);
        setFinalizingGames(mockFinalizingGames);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('gerenciar');
    }
  };

  const handleGameClick = (game) => {
    if (onNavigate) {
      onNavigate('visualizar-jogo', { gameData: game });
    }
  };

  return (
    <div className="jogos-menu-container">
      <Header 
        activeNav="Jogos" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <GamesSidebar 
          activeItem="Próximos Jogos" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title"> Próximos Jogos</h1>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando jogos...</p>
            </div>
          ) : (
            <div className="games-grid">
              {upcomingGames.map((game) => (
                <div 
                  key={game.id} 
                  className="game-card"
                  onClick={() => handleGameClick(game)}
                >
                  <div className="game-teams">
                    <span className="home-team">{game.homeTeam}</span>
                    <span className="vs">VS</span>
                    <span className="away-team">{game.awayTeam}</span>
                  </div>
                  <div className="game-date">{game.date}</div>
                  <div className="game-details">
                    <span className="game-time">{game.time}</span>
                    <span className="game-category">{game.category}</span>
                  </div>
                  <div className="game-actions">
                    <button className="action-btn view-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game);
                    }}>
                      Visualizar
                    </button>
                    <button className="action-btn finalize-btn" onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) {
                        onNavigate('finalizar-jogo', { gameData: game });
                      }
                    }}>
                      Finalizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="section-title finalizing-title">Jogos finalizados</h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando jogos...</p>
            </div>
          ) : (
            <div className="games-grid">
              {finalizingGames.map((game) => (
                <div 
                  key={game.id} 
                  className="game-card finalizing-card"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('jogo-finalizado', { gameData: game });
                    }
                  }}
                >
                  <div className="game-teams">
                    <span className="home-team">{game.homeTeam}</span>
                    <span className="vs">VS</span>
                    <span className="away-team">{game.awayTeam}</span>
                  </div>
                  <div className="game-date">{game.date}</div>
                  <div className="game-details">
                    <span className="game-time">{game.time}</span>
                    <span className="game-category">{game.category}</span>
                  </div>
                  <div className="game-status">{game.status}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JogosMenu;
