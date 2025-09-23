import React, { useState } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import BuscaAluno from './pages/BuscaAluno/BuscaAluno';
import CadastraAluno from './pages/CadastraAluno/CadastraAluno';
import EditaAluno from './pages/EditaAluno/EditaAluno';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentPage, setCurrentPage] = useState('busca'); // 'busca', 'cadastra', 'edita'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('busca');
  };

  const handleLogout = () => {
    console.log('Fazendo logout...');
    setIsLoggedIn(false);
    setCurrentPage('busca');
    setSelectedStudent(null);
  };

  const handleNavigation = (page, studentData = null) => {
    setCurrentPage(page);
    if (studentData) {
      setSelectedStudent(studentData);
    }
  };

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
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
      case 'busca':
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

export default App;