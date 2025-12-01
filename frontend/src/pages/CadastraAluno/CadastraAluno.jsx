import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import { studentService } from '../../services/api';
import './CadastraAluno.css';

const CadastraAluno = ({ onLogout, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      console.log('Enviando dados para o backend:', formData);
      
      const response = await studentService.create(formData);
      
      console.log('Aluno criado com sucesso:', response);
      showMessage('Aluno cadastrado com sucesso!', 'success');
      
      // Navegar para a lista de alunos após cadastro para atualizar a grid
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('gerenciar');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      showMessage(error.message || 'Erro ao cadastrar aluno. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
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
          <h1 className="panel-title">Cadastro de Alunos</h1>
          
          {message && (
            <div className={`form-message ${message.type}`}>
              <h3>{message.type === 'success' ? 'Sucesso!' : 'Erro!'}</h3>
              <p>{message.text}</p>
            </div>
          )}

          <StudentForm
            title="Cadastro de Alunos"
            submitButtonText={isLoading ? "Salvando..." : "Salvar"}
            onSubmit={handleFormSubmit}
            disabled={isLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default CadastraAluno;