import React, { useState } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import BuscaAluno from './pages/BuscaAluno/BuscaAluno';
import CadastraAluno from './pages/CadastraAluno/CadastraAluno';
import EditaAluno from './pages/EditaAluno/EditaAluno';
import VisualizarAluno from './pages/VisualizarAluno/VisualizarAluno';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('gerenciar'); // 'gerenciar', 'cadastra', 'edita', 'visualizar'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('gerenciar');
  };

  const handleLogout = () => {
    console.log('Fazendo logout...');
    setIsLoggedIn(false);
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
      case 'gerenciar':
      default:
        return (
          <BuscaAluno 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            onDeleteStudent={handleDeleteStudent}
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