import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import { useStudents } from '../../hooks/useStudents';
import { useAuth } from '../../hooks/useAuth';
import './CadastraAluno.css';

const CadastraAluno = ({ onLogout, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const { createStudent } = useStudents();
  const { logout } = useAuth();

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    
    try {
      const result = await createStudent(formData);
      
      if (result.success) {
        // Mostrar mensagem de sucesso
        const message = document.createElement('div');
        message.innerText = 'Aluno cadastrado com sucesso!';
        message.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #28a745;
          color: white;
          padding: 20px 40px;
          border-radius: 10px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
          document.body.removeChild(message);
          // Opcional: navegar para lista de alunos
          // onNavigate('gerenciar');
        }, 3000);
      } else {
        // Mostrar erro
        alert(`Erro ao cadastrar aluno: ${result.error}`);
      }
    } catch (error) {
      alert(`Erro inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="student-search-container">
      <Header activeNav="Alunos" onLogout={handleLogout} onNavigate={onNavigate} />
      
      <div className="main-content">
        <Sidebar 
          activeItem="Cadastrar Aluno" 
          onItemClick={handleSidebarClick} 
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Cadastro de Alunos</h1>
          
          {loading && (
            <div className="loading-message">
              Salvando dados do aluno...
            </div>
          )}

          <StudentForm
            title="Cadastro de Alunos"
            submitButtonText={loading ? "Salvando..." : "Salvar"}
            onSubmit={handleFormSubmit}
            disabled={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default CadastraAluno;