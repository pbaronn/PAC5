import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import GamesTable from '../../components/GamesTable/GamesTable';
import { gameService } from '../../services/api';
import './BuscaJogos.css';

const BuscaJogos = ({ onLogout, onNavigate }) => {
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatGameResult = (game) => {
    if (game.resultado && game.resultado.golsTime1 !== null && game.resultado.golsTime2 !== null) {
      return `${game.resultado.golsTime1}-${game.resultado.golsTime2}`;
    }
    return game.status === 'finalizado' ? 'Finalizado' : 'Agendado';
  };

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameService.getAll();
      if (response.success) {
        const formattedGames = response.data.map(game => ({
          id: game._id,
          nome: `${game.time1} vs ${game.time2}`,
          data: formatDate(game.dataJogo),
          placar: formatGameResult(game),
          adversario: game.time2,
          categoria: game.categoria,
          local: game.local,
          status: game.status,
          originalData: game
        }));
        
        setAllGames(formattedGames);
        setGames(formattedGames);
      } else {
        throw new Error(response.message || 'Erro ao buscar jogos');
      }
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      setError('Erro ao carregar jogos. Tente novamente.');
      setAllGames([]);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const filteredGames = allGames.filter((game) => {
      const matchesDate = selectedDate
        ? game.data === selectedDate
        : true;
      const matchesOpponent = opponentName
        ? game.adversario.toLowerCase().includes(opponentName.toLowerCase())
        : true;
      return matchesDate && matchesOpponent;
    });
    setGames(filteredGames);
  }, [selectedDate, opponentName, allGames]);

  const handleClear = () => {
    setSelectedDate('');
    setOpponentName('');
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

  const handleViewGame = (game) => {
    // Aqui você pode implementar a navegação para detalhes do jogo
    console.log('Jogo selecionado:', game);
  };

  const handleEditGame = (game) => {
    if (onNavigate) {
      onNavigate('visualizar-jogo-agendado', { gameData: { id: game.id } });
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await gameService.delete(gameId);
      if (response.success) {
        alert('Jogo excluído com sucesso!');
        await fetchGames(); // Recarregar a lista
      } else {
        throw new Error(response.message || 'Erro ao excluir jogo');
      }
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
      alert(`Erro ao excluir jogo: ${error.message}`);
    }
  };

  return (
    <div className="busca-jogos-container">
      <Header 
        activeNav="Jogos" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <GamesSidebar 
          activeItem="Buscar Jogos" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Busca de Jogos</h1>
          
          <SearchFilters
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            opponentName={opponentName}
            setOpponentName={setOpponentName}
            onClear={handleClear}
          />
          
          {error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={fetchGames} className="retry-btn">
                Tentar Novamente
              </button>
            </div>
          ) : (
            <GamesTable 
              games={games}
              onView={handleViewGame}
              onEdit={handleEditGame}
              onDelete={handleDeleteGame}
              loading={loading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default BuscaJogos;

