import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Users, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../../components/Header/Header';
import TreinosSidebar from '../../components/TreinosSidebar/TreinosSidebar';
import './Treinos.css';

const Treinos = ({ onLogout, onNavigate }) => {
  const [treinos, setTreinos] = useState([]);
  const [allTreinos, setAllTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTreinos, setShowAllTreinos] = useState(false);
  const [visibleTreinos, setVisibleTreinos] = useState(4);

  // Dados mockados para treinos
  const mockTreinos = [
    {
      id: 1,
      categoria: 'Sub-12',
      diasSemana: ['Segunda', 'Quarta', 'Sexta'],
      horarioInicio: '14:00',
      horarioFim: '15:30',
      local: 'Campo Principal',
      tecnico: 'João Silva'
    },
    {
      id: 2,
      categoria: 'Sub-14',
      diasSemana: ['Terça', 'Quinta'],
      horarioInicio: '16:00',
      horarioFim: '17:30',
      local: 'Campo 2',
      tecnico: 'Maria Santos'
    },
    {
      id: 3,
      categoria: 'Sub-16',
      diasSemana: ['Segunda', 'Quarta', 'Sexta'],
      horarioInicio: '18:00',
      horarioFim: '19:30',
      local: 'Campo Principal',
      tecnico: 'Pedro Costa'
    },
    {
      id: 4,
      categoria: 'Sub-18',
      diasSemana: ['Terça', 'Quinta', 'Sábado'],
      horarioInicio: '19:00',
      horarioFim: '20:30',
      local: 'Campo 2',
      tecnico: 'Ana Oliveira'
    }
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      setTreinos(mockTreinos);
      setAllTreinos(mockTreinos);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Filtra treinos baseado no termo de busca
    if (searchTerm.trim() === '') {
      setTreinos(allTreinos);
    } else {
      const filtered = allTreinos.filter(treino =>
        treino.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treino.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treino.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treino.diasSemana.some(dia => 
          dia.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setTreinos(filtered);
    }
  }, [searchTerm, allTreinos]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowMoreTreinos = () => {
    setShowAllTreinos(true);
    setVisibleTreinos(treinos.length);
  };

  const handleShowLessTreinos = () => {
    setShowAllTreinos(false);
    setVisibleTreinos(4);
  };

  const handleTreinoClick = (treino) => {
    if (onNavigate) {
      onNavigate('visualizar-treino', { treinoData: treino });
    }
  };

  const formatDiasSemana = (dias) => {
    return dias.join(', ');
  };

  const formatHorario = (inicio, fim) => {
    return `${inicio} - ${fim}`;
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
          activeItem="Treinos Agendados" 
          onItemClick={handleSidebarClick}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Treinos</h1>
          
          {/* Header com busca centralizada */}
          <div className="treinos-header">
            <div className="header-info">
              <Calendar size={24} className="header-icon" />
              <span className="header-text">Agenda de Treinos</span>
            </div>
            <div className="search-container-centered">
              <input
                type="text"
                placeholder="Buscar treinos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input-centered"
              />
              <Search size={20} className="search-icon-centered" />
            </div>
          </div>

          {/* Lista de treinos */}
          <div className="treinos-container">
            <div className="treinos-grid">
              {treinos.slice(0, visibleTreinos).map((treino) => (
                <div 
                  key={treino.id} 
                  className="treino-card"
                  onClick={() => handleTreinoClick(treino)}
                >
                  <div className="treino-header">
                    <div className="categoria-badge">
                      <Users size={18} />
                      <span>{treino.categoria}</span>
                    </div>
                  </div>
                  
                  <div className="treino-content">
                    <div className="treino-info">
                      <div className="info-item">
                        <Calendar size={16} className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">Dias da Semana</span>
                          <span className="info-value">{formatDiasSemana(treino.diasSemana)}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <Clock size={16} className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">Horário</span>
                          <span className="info-value">{formatHorario(treino.horarioInicio, treino.horarioFim)}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-content">
                          <span className="info-label">Local</span>
                          <span className="info-value">{treino.local}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-content">
                          <span className="info-label">Técnico</span>
                          <span className="info-value">{treino.tecnico}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão de scroll */}
            {treinos.length > 4 && (
              <div className="scroll-controls">
                {!showAllTreinos ? (
                  <button 
                    className="show-more-btn"
                    onClick={handleShowMoreTreinos}
                  >
                    <ChevronDown size={20} />
                    <span>Ver mais treinos ({treinos.length - visibleTreinos} restantes)</span>
                  </button>
                ) : (
                  <button 
                    className="show-less-btn"
                    onClick={handleShowLessTreinos}
                  >
                    <ChevronUp size={20} />
                    <span>Ver menos treinos</span>
                  </button>
                )}
              </div>
            )}
            
            {treinos.length === 0 && (
              <div className="no-treinos">
                <Calendar size={48} className="no-treinos-icon" />
                <h3>Nenhum treino cadastrado</h3>
                <p>Clique em "Adicionar Treino" para começar a organizar os treinos.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Treinos;
