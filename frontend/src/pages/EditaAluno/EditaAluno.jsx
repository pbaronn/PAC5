import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import { useStudents } from '../../hooks/useStudents';
import { useAuth } from '../../hooks/useAuth';
import './EditaAluno.css';

const EditaAluno = ({ onLogout, studentData = {}, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [currentStudentData, setCurrentStudentData] = useState(studentData);
  const { updateStudent, getStudentById } = useStudents();
  const { logout } = useAuth();

  // Buscar dados atualizados do aluno se necessário
  useEffect(() => {
    const loadStudentData = async () => {
      if (studentData.id && !studentData.nomeAluno && !studentData.name) {
        try {
          const result = await getStudentById(studentData.id);
          if (result.success) {
            setCurrentStudentData(result.data);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do aluno:', error);
        }
      }
    };

    loadStudentData();
  }, [studentData.id, getStudentById, studentData.nomeAluno, studentData.name]);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    
    try {
      const result = await updateStudent(currentStudentData.id, formData);
      
      if (result.success) {
        // Mostrar mensagem de sucesso
        const message = document.createElement('div');
        message.innerText = 'Aluno atualizado com sucesso!';
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
          // Voltar para a visualização
          onNavigate('visualizar', result.data.student, false);
        }, 2000);
      } else {
        alert(`Erro ao atualizar aluno: ${result.error}`);
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

  const handleBackToList = () => {
    if (onNavigate) {
      onNavigate('gerenciar');
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
          <div className="edit-header">
            <div className="edit-title-section">
              <h1 className="panel-title">Edição de Alunos</h1>
              <div className="student-info">
                <span className="student-name">
                  {currentStudentData?.nomeAluno || currentStudentData?.name || 'Aluno'}
                </span>
                <span className="student-id">ID: {currentStudentData?.id || 'N/A'}</span>
              </div>
            </div>
            
            <div className="edit-actions">
              <button 
                type="button" 
                className="back-btn"
                onClick={handleBackToList}
                disabled={loading}
              >
                ← Voltar à Lista
              </button>
            </div>
          </div>
          
          {loading && (
            <div className="loading-message">
              Salvando alterações...
            </div>
          )}
          
          <StudentForm
            title="Edição de Alunos"
            submitButtonText={loading ? "Salvando..." : "Atualizar"}
            onSubmit={handleFormSubmit}
            initialData={currentStudentData}
            disabled={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default EditaAluno;