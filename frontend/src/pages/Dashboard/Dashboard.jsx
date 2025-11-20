import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Trophy, Gift, ArrowRight } from 'lucide-react';
import Header from '../../components/Header/Header';
import { gameService, studentService } from '../../services/api';
import './Dashboard.css';

const Dashboard = ({ onLogout, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [proximoJogo, setProximoJogo] = useState(null);
  const [aniversariantes, setAniversariantes] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar próximo jogo
      await loadProximoJogo();
      
      // Buscar aniversariantes do mês
      await loadAniversariantes();
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProximoJogo = async () => {
    try {
      const hoje = new Date();
      const response = await gameService.getAll({
        futuro: 'true',
        sortBy: 'dataJogo',
        sortOrder: 'asc',
        limit: 1
      });
      
      if (response.success && response.data.length > 0) {
        setProximoJogo(response.data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar próximo jogo:', error);
    }
  };

  const loadAniversariantes = async () => {
    try {
      const response = await studentService.getAll();
      
      if (response.success) {
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        
        // Mapear todos os alunos com suas datas de próximo aniversário
        const alunosComAniversario = response.students
          .map(aluno => {
            const dataNasc = new Date(aluno.dataNascimento);
            
            // Criar data do próximo aniversário neste ano
            const proximoAniversario = new Date(
              anoAtual, 
              dataNasc.getMonth(), 
              dataNasc.getDate()
            );
            
            // Se já passou este ano, considerar próximo ano
            if (proximoAniversario < hoje) {
              proximoAniversario.setFullYear(anoAtual + 1);
            }
            
            // Calcular dias até o aniversário
            const diasAte = Math.ceil((proximoAniversario - hoje) / (1000 * 60 * 60 * 24));
            
            return {
              ...aluno,
              proximoAniversario,
              diasAte,
              idade: anoAtual - dataNasc.getFullYear()
            };
          })
          .sort((a, b) => a.diasAte - b.diasAte)
          .slice(0, 3); // Pegar os 3 próximos
        
        setAniversariantes(alunosComAniversario);
      }
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
    }
  };

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
      if (proximoJogo) {
        onNavigate('visualizar-jogo', { 
          gameData: { 
            ...proximoJogo, 
            id: proximoJogo._id 
          } 
        });
      } else {
        onNavigate('jogos-menu');
      }
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
          {/* Próximo Jogo */}
          <div 
            className="dashboard-card jogo-card"
            onClick={() => handleCardClick('jogo', proximoJogo)}
          >
            <div className="card-header">
              <div className="card-icon">
                <Trophy size={24} />
              </div>
              <h3>Próximo Jogo</h3>
              <ArrowRight size={20} className="card-arrow" />
            </div>
            
            <div className="card-content">
              {proximoJogo ? (
                <div className="card-info">
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{formatDate(proximoJogo.dataJogo)} às {formatTime(proximoJogo.horario)}</span>
                  </div>
                  <div className="info-item">
                    <Users size={16} />
                    <span>{proximoJogo.categoria}</span>
                  </div>
                  <div className="info-item">
                    <span>{proximoJogo.time1} vs {proximoJogo.time2}</span>
                  </div>
                  <div className="info-item">
                    <span>{proximoJogo.local}</span>
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <p>Nenhum jogo agendado</p>
                </div>
              )}
            </div>
          </div>

          {/* Aniversariantes do Mês */}
          <div 
            className="dashboard-card aniversario-card"
            onClick={() => handleCardClick('alunos', aniversariantes)}
          >
            <div className="card-header">
              <div className="card-icon">
                <Gift size={24} />
              </div>
              <h3>Próximos Aniversários</h3>
              <ArrowRight size={20} className="card-arrow" />
            </div>
            
            <div className="card-content">
              {aniversariantes.length > 0 ? (
                <div className="aniversariantes-list">
                  {aniversariantes.map((aluno) => (
                    <div key={aluno._id} className="aniversariante-item">
                      <div className="aniversariante-info">
                        <span className="nome">{aluno.nomeAluno}</span>
                        <span className="idade">
                          {aluno.diasAte === 0 ? '🎉 Hoje!' : 
                           aluno.diasAte === 1 ? 'Amanhã' : 
                           `Em ${aluno.diasAte} dias`}
                        </span>
                      </div>
                      <span className="data">{formatDate(aluno.proximoAniversario)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <p>Nenhum aniversário este mês</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
