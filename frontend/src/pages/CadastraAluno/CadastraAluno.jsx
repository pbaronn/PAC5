import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StudentForm from '../../components/StudentForm/StudentForm';
import './CadastraAluno.css';

const CadastraAluno = ({ onLogout, onNavigate }) => {
  const handleFormSubmit = (formData) => {
    console.log('Dados do Aluno:', formData);
    

    
    const message = document.createElement('div');
    message.innerText = 'Formulário enviado com sucesso! Verifique o console para ver os dados.';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--primary-color);
      color: white;
      padding: 20px 40px;
      border-radius: 10px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(message);
    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);
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
          <h1 className="panel-title"> Cadastro de Alunos </h1>
          

          <StudentForm
            title=" Cadastro de Alunos"
            submitButtonText="Salvar"
            onSubmit={handleFormSubmit}
          />
        </main>
      </div>
    </div>
  );
};

export default CadastraAluno;