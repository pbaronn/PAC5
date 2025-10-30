import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import { studentService } from '../../services/api';
import './EditaAluno.css';

const EditaAluno = ({ onLogout, studentData = {}, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStudentData, setCurrentStudentData] = useState(studentData);

  // Se não temos dados do aluno e temos um ID, buscar do backend
  useEffect(() => {
    const loadStudentData = async () => {
      if (!currentStudentData._id && !currentStudentData.id) {
        setError('ID do aluno não fornecido');
        return;
      }

      if (!currentStudentData.nomeAluno) {
        try {
          setLoading(true);
          const studentId = currentStudentData._id || currentStudentData.id;
          const student = await studentService.getById(studentId);
          setCurrentStudentData(student);
        } catch (error) {
          console.error('Erro ao carregar dados do aluno:', error);
          setError('Erro ao carregar dados do aluno: ' + error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadStudentData();
  }, [currentStudentData._id, currentStudentData.id, currentStudentData.nomeAluno]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const studentId = currentStudentData._id || currentStudentData.id;
      
      if (!studentId) {
        throw new Error('ID do aluno não encontrado');
      }

      console.log('Atualizando aluno com ID:', studentId);
      console.log('Dados enviados:', formData);
      
      await studentService.update(studentId, formData);
      
      showSuccessMessage(`Aluno "${formData.nomeAluno}" foi atualizado com sucesso!`);
      
      // Atualizar dados locais
      setCurrentStudentData({ ...currentStudentData, ...formData });
      
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      setError('Erro ao atualizar aluno: ' + (error.message || 'Erro desconhecido'));
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

  return (
    <div className="student-search-container">
      <Header activeNav="Alunos" onLogout={onLogout} onNavigate={onNavigate} />
      
      <div className="main-content">
        <Sidebar 
          activeItem="Cadastrar Aluno" 
          onItemClick={handleSidebarClick} 
        />
        
        <main className="main-panel">
          {loading && (
            <div className="loading-message" style={{
              textAlign: 'center',
              padding: '20px',
              color: '#666'
            }}>
              Carregando dados do aluno...
            </div>
          )}
          
          {error && (
            <div className="error-message" style={{
              color: 'red',
              background: 'rgba(255,0,0,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid rgba(255,0,0,0.3)'
            }}>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="success-message" style={{
              color: 'green',
              background: 'rgba(0,255,0,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid rgba(0,255,0,0.3)'
            }}>
              {successMessage}
            </div>
          )}
          
          <div className="edit-header">
            <div className="edit-title-section">
              <h1 className="panel-title">Edição de Alunos</h1>
              <div className="student-info">
                <span className="student-name">{currentStudentData?.nomeAluno || currentStudentData?.name || 'Aluno'}</span>
                <span className="student-id">ID: {currentStudentData?._id || currentStudentData?.id || 'N/A'}</span>
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
          
          {!loading && !error && (
            <StudentForm
              title="Edição de Alunos"
              submitButtonText="Atualizar"
              onSubmit={handleFormSubmit}
              initialData={currentStudentData}
              editMode={true}
              disabled={loading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default EditaAluno;