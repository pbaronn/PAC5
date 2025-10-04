import React, { useState } from 'react';
import { Eye, ChevronUp, ChevronDown } from 'lucide-react';
import './GamesTable.css';

const GamesTable = ({ games, onView, onEdit, onDelete, loading }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedGames = () => {
    if (!sortField) return games;

    return [...games].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'data') {
        // Converte data para formato comparável
        aValue = new Date(aValue.split('/').reverse().join('-'));
        bValue = new Date(bValue.split('/').reverse().join('-'));
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronUp size={16} className="sort-icon inactive" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={16} className="sort-icon active" />
      : <ChevronDown size={16} className="sort-icon active" />;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Carregando jogos...</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚽</div>
        <h3>Nenhum jogo encontrado</h3>
        <p>Não há jogos que correspondam aos filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="games-table-container">
      <div className="results-header">
        <div className="results-count">
          Mostrando <span className="count-number">{games.length}</span> jogo{games.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="table-container">
        <table className="games-table">
          <thead>
            <tr>
              <th 
                className="sortable" 
                onClick={() => handleSort('id')}
              >
                ID
                {getSortIcon('id')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('nome')}
              >
                Nome
                {getSortIcon('nome')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('data')}
              >
                Data
                {getSortIcon('data')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('placar')}
              >
                Placar
                {getSortIcon('placar')}
              </th>
              <th className="actions-header">Ações</th>
            </tr>
          </thead>
          <tbody>
            {getSortedGames().map((game, index) => (
              <tr key={game.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td className="id-cell">{game.id}</td>
                <td className="name-cell">{game.nome}</td>
                <td className="date-cell">{game.data}</td>
                <td className="score-cell">{game.placar}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => onView(game)}
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GamesTable;

