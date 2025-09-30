import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth'; // ou './contexts/AuthContext'
import LoginPage from './pages/LoginPage/LoginPage';
import BuscaAluno from './pages/BuscaAluno/BuscaAluno';
import CadastraAluno from './pages/CadastraAluno/CadastraAluno';
import EditaAluno from './pages/EditaAluno/EditaAluno';
import VisualizarAluno from './pages/VisualizarAluno/VisualizarAluno';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('gerenciar');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleLoginSuccess = () => {
    setCurrentPage('gerenciar');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('gerenciar');
    setSelectedStudent(null);
    setEditMode(false);
  };

  const handleNavigation = (page, studentData = null, edit = false) => {
    console.log('Navegando para:', page, 'com dados:', studentData);
    setCurrentPage(page);
    setSelectedStudent(studentData);
    setEditMode(edit);
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="app-loading">
        <div>Carregando...</div>
      </div>
    );
  }

  // Se não estiver logado, mostra a tela de login
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Função para renderizar a página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
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
          />
        );
      case 'gerenciar':
      default:
        return (
          <BuscaAluno 
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

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;