import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import { useStudents } from '../../hooks/useStudents';
import { useAuth } from '../../hooks/useAuth';
import './VisualizarAluno.css';

const VisualizarAluno = ({ 
  onLogout, 
  studentData, 
  onNavigate,
  editMode,
  onEditModeChange
}) => {
  const [loading, setLoading] = useState(false);
  const [currentStudentData, setCurrentStudentData] = useState(studentData);
  const { updateStudent, deleteStudent, getStudentById } = useStudents();
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
        // Atualizar dados locais
        setCurrentStudentData(result.data.student);
        
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
          onEditModeChange(false); // Volta para modo visualização
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

  const handleEditToggle = () => {
    onEditModeChange(!editMode);
  };

  const handleCancelEdit = () => {
    onEditModeChange(false);
  };

  const handleDeleteStudent = async () => {
    const studentName = currentStudentData?.nomeAluno || currentStudentData?.name;
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o aluno ${studentName}? Esta ação não pode ser desfeita.`
    );
    
    if (confirmDelete) {
      try {
        const result = await deleteStudent(currentStudentData.id);
        if (result.success) {
          // Mostrar mensagem e voltar para lista
          alert('Aluno excluído com sucesso!');
          onNavigate('gerenciar');
        } else {
          alert(`Erro ao excluir aluno: ${result.error}`);
        }
      } catch (error) {
        alert(`Erro inesperado: ${error.message}`);
      }
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
          activeItem="Gerenciar Alunos" 
          onItemClick={handleSidebarClick} 
        />
        
        <main className="main-panel">
          <div className="view-header">
            <div className="view-title-section">
              <h1 className="panel-title">
                {editMode ? 'Editando Aluno' : 'Visualizar Aluno'}
              </h1>
              <div className="student-info">
                <span className="student-name">
                  {currentStudentData?.nomeAluno || currentStudentData?.name}
                </span>
                <span className="student-id">ID: {currentStudentData?.id}</span>
              </div>
            </div>
            
            <div className="view-actions">
              <button 
                type="button" 
                className="back-btn"
                onClick={handleBackToList}
                disabled={loading}
              >
                ← Voltar à Lista
              </button>
              
              {!editMode ? (
                <>
                  <button 
                    type="button" 
                    className="edit-btn"
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={handleDeleteStudent}
                    disabled={loading}
                  >
                    🗑️ Excluir
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="cancel-edit-btn"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  ✖️ Cancelar Edição
                </button>
              )}
            </div>
          </div>
          
          {loading && (
            <div className="loading-message">
              {editMode ? 'Salvando alterações...' : 'Carregando dados...'}
            </div>
          )}
          
          <StudentForm
            title={editMode ? 'Editando dados do aluno' : 'Dados do aluno'}
            submitButtonText={editMode ? (loading ? 'Salvando...' : 'Salvar Alterações') : ''}
            onSubmit={editMode ? handleFormSubmit : null}
            initialData={currentStudentData}
            viewMode={!editMode}
            editMode={editMode}
            disabled={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default VisualizarAluno;