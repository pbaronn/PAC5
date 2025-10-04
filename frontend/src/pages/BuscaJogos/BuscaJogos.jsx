import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import GamesTable from '../../components/GamesTable/GamesTable';
import './BuscaJogos.css';

const BuscaJogos = ({ onLogout, onNavigate }) => {
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [loading, setLoading] = useState(true);

  // Dados mockados para jogos
  const mockGames = [
    { 
      id: 1, 
      nome: 'JEC vs São Paulo FC', 
      data: '15/06/2025',
      placar: '2-1',
      adversario: 'São Paulo FC',
      categoria: 'Sub-7',
      local: 'Campo Principal'
    },
    { 
      id: 2, 
      nome: 'JEC vs Palmeiras', 
      data: '29/07/2025',
      placar: '1-3',
      adversario: 'Palmeiras',
      categoria: 'Sub-8',
      local: 'Campo 2'
    },
    { 
      id: 3, 
      nome: 'JEC vs Santos', 
      data: '15/06/2025',
      placar: '0-0',
      adversario: 'Santos',
      categoria: 'Sub-6',
      local: 'Campo Principal'
    },
    { 
      id: 4, 
      nome: 'JEC vs Corinthians', 
      data: '29/07/2025',
      placar: '3-2',
      adversario: 'Corinthians',
      categoria: 'Sub-9',
      local: 'Campo 1'
    },
    { 
      id: 5, 
      nome: 'JEC vs Flamengo', 
      data: '10/08/2025',
      placar: '1-1',
      adversario: 'Flamengo',
      categoria: 'Sub-7',
      local: 'Campo Principal'
    },
    { 
      id: 6, 
      nome: 'JEC vs Grêmio', 
      data: '25/08/2025',
      placar: '2-0',
      adversario: 'Grêmio',
      categoria: 'Sub-8',
      local: 'Campo 2'
    }
  ];

  const fetchGames = async () => {
    setLoading(true);
    try {
      // Simula carregamento
      setTimeout(() => {
        setAllGames(mockGames);
        setGames(mockGames);
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
    // Aqui você pode implementar a navegação para edição do jogo
    console.log('Editar jogo:', game);
  };

  const handleDeleteGame = (gameId) => {
    // Aqui você pode implementar a exclusão do jogo
    console.log('Excluir jogo:', gameId);
    const updatedGames = allGames.filter(game => game.id !== gameId);
    setAllGames(updatedGames);
    setGames(updatedGames);
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
          
          <GamesTable 
            games={games}
            onView={handleViewGame}
            onEdit={handleEditGame}
            onDelete={handleDeleteGame}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default BuscaJogos;

