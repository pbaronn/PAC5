// src/pages/VisualizarAluno/VisualizarAluno.jsx
import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import './VisualizarAluno.css';

const VisualizarAluno = ({ 
  onLogout, 
  studentData, 
  onNavigate,
  editMode,
  onEditModeChange,
  onDeleteStudent
}) => {
  const handleFormSubmit = (formData) => {
    console.log('Dados do Aluno Atualizados:', formData);
    
    // Aqui você faria a chamada para a API para atualizar
    // await fetch(`/api/students/${studentData.id}`, { method: 'PUT', body: JSON.stringify(formData) })
    
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

  const handleDeleteStudent = () => {
    if (window.confirm(`Tem certeza que deseja excluir o aluno ${studentData?.nomeAluno || studentData?.name}? Esta ação não pode ser desfeita.`)) {
      if (onDeleteStudent) {
        onDeleteStudent(studentData.id);
        // Volta para a lista após excluir
        if (onNavigate) {
          onNavigate('gerenciar');
        }
      }
    }
  };

  return (
    <div className="student-search-container">
      <Header activeNav="Alunos" onLogout={onLogout} onNavigate={onNavigate} />
      
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
                <span className="student-name">{studentData?.nomeAluno || studentData?.name}</span>
                <span className="student-id">ID: {studentData?.id}</span>
              </div>
            </div>
            
            <div className="view-actions">
              <button 
                type="button" 
                className="back-btn"
                onClick={handleBackToList}
              >
                ← Voltar à Lista
              </button>
              
              {!editMode ? (
                <>
                  <button 
                    type="button" 
                    className="edit-btn"
                    onClick={handleEditToggle}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={handleDeleteStudent}
                  >
                    🗑️ Excluir
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="cancel-edit-btn"
                  onClick={handleCancelEdit}
                >
                  ✖️ Cancelar Edição
                </button>
              )}
            </div>
          </div>
          
          <StudentForm
            title={editMode ? 'Editando dados do aluno' : 'Dados do aluno'}
            submitButtonText={editMode ? 'Salvar Alterações' : ''}
            onSubmit={editMode ? handleFormSubmit : null}
            initialData={studentData}
            viewMode={!editMode}
            editMode={editMode}
          />
        </main>
      </div>
    </div>
  );
};

export default VisualizarAluno;