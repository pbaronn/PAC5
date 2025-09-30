import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import StudentsTable from '../../components/StudentsTable/StudentsTable';
import { useStudents } from '../../hooks/useStudents';
import { useAuth } from '../../hooks/useAuth';
import './BuscaAluno.css';

const BuscaAluno = ({ onLogout, onNavigate, onDeleteStudent }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [studentName, setStudentName] = useState('');
  
  const { students, categories, loading, error, loadStudents, deleteStudent } = useStudents();
  const { logout } = useAuth();

  // Carrega alunos na inicialização
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Aplicar filtros quando mudam
  useEffect(() => {
    const filters = {};
    if (selectedCategory) filters.category = selectedCategory;
    if (studentName) filters.name = studentName;
    
    loadStudents(filters);
  }, [selectedCategory, studentName, loadStudents]);

  const handleClear = () => {
    setSelectedCategory('');
    setStudentName('');
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleViewStudent = (student) => {
    if (onNavigate) {
      onNavigate('visualizar', student, false);
    }
  };

  const handleEditStudent = (student) => {
    if (onNavigate) {
      onNavigate('edita', student, false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o aluno ${student?.nomeAluno || student?.name}? Esta ação não pode ser desfeita.`
    );
    
    if (confirmDelete) {
      const result = await deleteStudent(studentId);
      if (result.success) {
        // Opcional: mostrar mensagem de sucesso
        console.log('Aluno excluído com sucesso!');
      } else {
        alert(`Erro ao excluir aluno: ${result.error}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  // Mapear dados para o formato esperado pela tabela
  const mappedStudents = students.map(student => ({
    ...student,
    name: student.nomeAluno || student.name // Compatibilidade com formato antigo
  }));

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Alunos" 
        onLogout={handleLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <Sidebar 
          activeItem="Gerenciar Alunos" 
          onItemClick={handleSidebarClick} 
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Gerenciar Alunos</h1>
          
          <SearchFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            studentName={studentName}
            setStudentName={setStudentName}
            onClear={handleClear}
            categories={categories}
          />
          
          {loading && (
            <div className="loading-message">
              Carregando alunos...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              Erro ao carregar alunos: {error}
            </div>
          )}
          
          {!loading && !error && (
            <StudentsTable 
              students={mappedStudents}
              onView={handleViewStudent}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default BuscaAluno;