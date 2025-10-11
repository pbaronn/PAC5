import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Trophy, Gift, ArrowRight } from 'lucide-react';
import Header from '../../components/Header/Header';
import './Dashboard.css';

const Dashboard = ({ onLogout, onNavigate }) => {
  const [loading, setLoading] = useState(true);

  // Dados mockados para próximas atividades
  const mockProximoTreino = {
    id: 1,
    categoria: 'Sub-14',
    data: '2024-01-15',
    horario: '16:00',
    local: 'Campo Principal',
    tecnico: 'João Silva'
  };

  const mockProximoJogo = {
    id: 1,
    adversario: 'Clube Atlético',
    data: '2024-01-18',
    horario: '15:30',
    local: 'Campo Principal',
    categoria: 'Sub-14'
  };

  const mockAniversariantes = [
    { id: 1, nome: 'João Silva', idade: 13, data: '2024-01-10' },
    { id: 2, nome: 'Maria Santos', idade: 12, data: '2024-01-22' },
    { id: 3, nome: 'Pedro Costa', idade: 14, data: '2024-01-28' }
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleCardClick = (type, data) => {
    if (type === 'treino') {
      onNavigate('treinos');
    } else if (type === 'jogo') {
      onNavigate('jogos-menu');
    } else if (type === 'alunos') {
      onNavigate('gerenciar');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Header 
          activeNav="Dashboard" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header 
        activeNav="Menu" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Menu</h1>
          <p className="dashboard-subtitle">Bem-vindo! Aqui estão suas próximas atividades</p>
        </div>

        <div className="dashboard-grid">
          {/* Próximo Treino */}
          <div 
            className="dashboard-card treino-card"
            onClick={() => handleCardClick('treino', mockProximoTreino)}
          >
            <div className="card-header">
              <div className="card-icon">
                <Calendar size={24} />
              </div>
              <h3>Próximo Treino</h3>
              <ArrowRight size={20} className="card-arrow" />
            </div>
            
            <div className="card-content">
              <div className="card-info">
                <div className="info-item">
                  <Clock size={16} />
                  <span>{formatDate(mockProximoTreino.data)} às {formatTime(mockProximoTreino.horario)}</span>
                </div>
                <div className="info-item">
                  <Users size={16} />
                  <span>{mockProximoTreino.categoria}</span>
                </div>
                <div className="info-item">
                  <span>{mockProximoTreino.local}</span>
                </div>
                <div className="info-item">
                  <span>Técnico: {mockProximoTreino.tecnico}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Próximo Jogo */}
          <div 
            className="dashboard-card jogo-card"
            onClick={() => handleCardClick('jogo', mockProximoJogo)}
          >
            <div className="card-header">
              <div className="card-icon">
                <Trophy size={24} />
              </div>
              <h3>Próximo Jogo</h3>
              <ArrowRight size={20} className="card-arrow" />
            </div>
            
            <div className="card-content">
              <div className="card-info">
                <div className="info-item">
                  <Clock size={16} />
                  <span>{formatDate(mockProximoJogo.data)} às {formatTime(mockProximoJogo.horario)}</span>
                </div>
                <div className="info-item">
                  <Users size={16} />
                  <span>{mockProximoJogo.categoria}</span>
                </div>
                <div className="info-item">
                  <span>vs {mockProximoJogo.adversario}</span>
                </div>
                <div className="info-item">
                  <span>{mockProximoJogo.local}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aniversariantes do Mês */}
          <div 
            className="dashboard-card aniversario-card"
            onClick={() => handleCardClick('alunos', mockAniversariantes)}
          >
            <div className="card-header">
              <div className="card-icon">
                <Gift size={24} />
              </div>
              <h3>Aniversariantes do Mês</h3>
              <ArrowRight size={20} className="card-arrow" />
            </div>
            
            <div className="card-content">
              <div className="aniversariantes-list">
                {mockAniversariantes.map((aluno) => (
                  <div key={aluno.id} className="aniversariante-item">
                    <div className="aniversariante-info">
                      <span className="nome">{aluno.nome}</span>
                      <span className="idade">{aluno.idade} anos</span>
                    </div>
                    <span className="data">{formatDate(aluno.data)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
