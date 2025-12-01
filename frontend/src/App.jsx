import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import BuscaAluno from './pages/BuscaAluno/BuscaAluno';
import CadastraAluno from './pages/CadastraAluno/CadastraAluno';
import EditaAluno from './pages/EditaAluno/EditaAluno';
import VisualizarAluno from './pages/VisualizarAluno/VisualizarAluno';
import JogosMenu from './pages/JogosMenu/JogosMenu';
import BuscaJogos from './pages/BuscaJogos/BuscaJogos';
import CadastrarJogo from './pages/CadastrarJogo/CadastrarJogo';
import VisualizarJogoAgendado from './pages/VisualizarJogoAgendado/VisualizarJogoAgendado';
import FinalizarJogo from './pages/FinalizarJogo/FinalizarJogo';
import JogoFinalizado from './pages/JogoFinalizado/JogoFinalizado';
import MenuCategorias from './pages/MenuCategorias/MenuCategorias';
import CriarCategoria from './pages/CriarCategoria/CriarCategoria';
import VisualizarCategoria from './pages/VisualizarCategoria/VisualizarCategoria';
import EditarCategoria from './pages/EditarCategoria/EditarCategoria';
import Treinos from './pages/Treinos/Treinos';
import AdicionarTreino from './pages/AdicionarTreino/AdicionarTreino';
import VisualizarTreino from './pages/VisualizarTreino/VisualizarTreino';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import Dashboard from './pages/Dashboard/Dashboard';
import { authService } from './services/api';
import './App.css';

const App = () => {
  // Verificar se há sessão salva no localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return authService.isAuthenticated();
  });
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'gerenciar', 'cadastra', 'edita', 'visualizar', 'jogos-menu', 'buscar-jogos', 'cadastrar-jogo', 'visualizar-jogo', 'finalizar-jogo', 'jogo-finalizado', 'menu-categorias', 'criar-categoria', 'visualizar-categoria', 'editar-categoria', 'treinos', 'adicionar-treino', 'visualizar-treino', 'configuracoes'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Validar token com o backend
          await authService.validateToken();
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Token inválido:', error);
          // Se o token for inválido, fazer logout
          authService.logout();
          setIsLoggedIn(false);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    console.log('Fazendo logout...');
    authService.logout(); // Limpa token e user do localStorage
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setSelectedStudent(null);
    setEditMode(false);
  };

  const handleNavigation = (page, data = null, edit = false) => {
    console.log('Navegando para:', page, 'com dados:', data);
    setCurrentPage(page);
    
    // Limpar estados anteriores quando não há dados
    if (!data) {
      setSelectedGame(null);
      setSelectedCategory(null);
      setSelectedTreino(null);
      setSelectedStudent(null);
    }
    
    // Se for dados de jogo, armazena em selectedGame
    if (data && data.gameData) {
      console.log('Armazenando gameData:', data.gameData);
      setSelectedGame(data.gameData);
      setSelectedCategory(null);
      setSelectedTreino(null);
      setSelectedStudent(null);
    } else if (data && data.categoryData) {
      console.log('Armazenando categoryData:', data.categoryData);
      console.log('Category ID:', data.categoryData._id);
      setSelectedCategory(data.categoryData);
      setSelectedGame(null);
      setSelectedTreino(null);
      setSelectedStudent(null);
    } else if (data && data.treinoData) {
      console.log('Armazenando treinoData:', data.treinoData);
      setSelectedTreino(data.treinoData);
      setSelectedGame(null);
      setSelectedCategory(null);
      setSelectedStudent(null);
    } else if (data) {
      console.log('Armazenando studentData:', data);
      setSelectedStudent(data);
      setSelectedGame(null);
      setSelectedCategory(null);
      setSelectedTreino(null);
    }
    
    setEditMode(edit);
  };

  const handleDeleteStudent = (studentId) => {
    console.log('Excluindo aluno:', studentId);
    // Aqui você implementaria a lógica de exclusão
  };

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Função para renderizar a página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'cadastra':
        return (
          <CadastraAluno 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'edita':
        return (
          <EditaAluno 
            onLogout={handleLogout}
            studentData={selectedStudent}
            onNavigate={handleNavigation}
          />
        );
      case 'visualizar':
        return (
          <VisualizarAluno 
            onLogout={handleLogout} 
            studentData={selectedStudent}
            onNavigate={handleNavigation}
            editMode={editMode}
            onEditModeChange={setEditMode}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'jogos-menu':
        return (
          <JogosMenu 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'buscar-jogos':
        return (
          <BuscaJogos 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'cadastrar-jogo':
        return (
          <CadastrarJogo 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'visualizar-jogo':
        return (
          <VisualizarJogoAgendado 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            gameData={selectedGame}
          />
        );
      case 'finalizar-jogo':
        return (
          <FinalizarJogo 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            gameData={selectedGame}
          />
        );
      case 'jogo-finalizado':
        return (
          <JogoFinalizado 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            gameData={selectedGame}
          />
        );
      case 'menu-categorias':
        return (
          <MenuCategorias 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'criar-categoria':
        return (
          <CriarCategoria 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'visualizar-categoria':
        return (
          <VisualizarCategoria 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            categoryData={selectedCategory}
          />
        );
      case 'editar-categoria':
        return (
          <EditarCategoria 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            categoryData={selectedCategory}
          />
        );
      case 'treinos':
        return (
          <Treinos 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'adicionar-treino':
        return (
          <AdicionarTreino 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'visualizar-treino':
        return (
          <VisualizarTreino 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            treinoData={selectedTreino}
          />
        );
      case 'configuracoes':
        return (
          <Configuracoes 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'gerenciar':
        return (
          <BuscaAluno 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      default:
        return (
          <Dashboard 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <div className="app">
      {renderCurrentPage()}
    </div>
  );
};

export default App;