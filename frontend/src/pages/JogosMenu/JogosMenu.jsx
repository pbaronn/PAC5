import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import { gameService } from '../../services/api';
import './JogosMenu.css';

const JogosMenu = ({ onLogout, onNavigate }) => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [finishedGames, setFinishedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar próximos jogos
      const upcomingResponse = await gameService.getUpcomingGames();
      if (upcomingResponse.success) {
        const formattedUpcoming = upcomingResponse.data.map(game => ({
          id: game._id,
          homeTeam: game.time1,
          awayTeam: game.time2,
          date: formatDate(game.dataJogo),
          time: game.horario,
          category: game.categoria,
          location: game.local
        }));
        setUpcomingGames(formattedUpcoming);
      }

      // Buscar jogos finalizados
      const finishedResponse = await gameService.getFinishedGames();
      if (finishedResponse.success) {
        const formattedFinished = finishedResponse.data
          .filter(game => game.status === 'finalizado') // Apenas jogos já finalizados
          .map(game => ({
            id: game._id,
            homeTeam: game.time1,
            awayTeam: game.time2,
            date: formatDate(game.dataJogo),
            time: game.horario,
            category: game.categoria,
            location: game.local,
            golsTime1: game.resultado?.golsTime1 || 0,
            golsTime2: game.resultado?.golsTime2 || 0,
            status: 'Finalizado'
          }));
        setFinishedGames(formattedFinished);
      }
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      setError('Erro ao carregar jogos. Tente novamente.');
      setUpcomingGames([]);
      setFinishedGames([]);
    } finally {
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
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={fetchGames} className="retry-btn">
                Tentar Novamente
              </button>
            </div>
          ) : upcomingGames.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum jogo agendado encontrado.</p>
              <button onClick={() => onNavigate && onNavigate('cadastrar-jogo')} className="add-game-btn">
                Cadastrar Novo Jogo
              </button>
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
                    <button className="action-btn-jogo view-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game);
                    }}>
                      Visualizar
                    </button>
                    <button className="action-btn-jogo finalize-btn" onClick={(e) => {
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

          <h2 className="section-title finalizing-title">Jogos Finalizados</h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando jogos...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
            </div>
          ) : finishedGames.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum jogo finalizado encontrado.</p>
            </div>
          ) : (
            <div className="games-grid">
              {finishedGames.map((game) => (
                <div 
                  key={game.id} 
                  className="game-card finished-card"
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
                  <div className="game-score">
                    <span className="score">{game.golsTime1}</span>
                    <span className="score-separator">-</span>
                    <span className="score">{game.golsTime2}</span>
                  </div>
                  <div className="game-date">{game.date}</div>
                  <div className="game-details">
                    <span className="game-time">{game.time}</span>
                    <span className="game-category">{game.category}</span>
                  </div>
                  <div className="game-status finished-status">{game.status}</div>
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
