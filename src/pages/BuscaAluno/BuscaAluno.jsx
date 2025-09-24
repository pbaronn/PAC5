import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import StudentsTable from '../../components/StudentsTable/StudentsTable';
import './BuscaAluno.css';

const BuscaAluno = ({ onLogout, onNavigate, onDeleteStudent }) => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);

  // Dados mockados para teste (remova quando tiver API real)
  const mockStudents = [
    { 
      id: 1, 
      name: 'João Silva', 
      category: 'Sub-7', 
      status: 'Ativo',
      nomeAluno: 'João Silva',
      dataNascimento: '2017-05-15',
      genero: 'masculino',
      telefone: '(11) 99999-1111',
      telefone2: '(11) 8888-1111',
      cpf: '123.456.789-01',
      rg: '12.345.678-9',
      rua: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '01234-567',
      nomeResponsavel: 'Maria Silva',
      cpfResponsavel: '987.654.321-09',
      telefoneResponsavel: '(11) 77777-1111',
      grauParentesco: 'mae'
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      category: 'Sub-6', 
      status: 'Ativo',
      nomeAluno: 'Maria Santos',
      dataNascimento: '2018-03-22',
      genero: 'feminino',
      telefone: '(11) 99999-2222',
      cpf: '123.456.789-02',
      rg: '12.345.678-8'
    },
    { 
      id: 3, 
      name: 'Pedro Oliveira', 
      category: 'Sub-8', 
      status: 'Inativo',
      nomeAluno: 'Pedro Oliveira',
      dataNascimento: '2016-08-10',
      genero: 'masculino',
      telefone: '(11) 99999-3333',
      cpf: '123.456.789-03',
      rg: '12.345.678-7'
    }
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Simula carregamento
      setTimeout(() => {
        setAllStudents(mockStudents);
        setStudents(mockStudents);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filteredStudents = allStudents.filter((student) => {
      const matchesCategory = selectedCategory
        ? student.category === selectedCategory
        : true;
      const matchesName = studentName
        ? student.name.toLowerCase().includes(studentName.toLowerCase())
        : true;
      return matchesCategory && matchesName;
    });
    setStudents(filteredStudents);
  }, [selectedCategory, studentName, allStudents]);

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

  const handleDeleteStudent = (studentId) => {
    if (onDeleteStudent) {
      onDeleteStudent(studentId);
      // Remove o aluno da lista local
      const updatedStudents = allStudents.filter(student => student.id !== studentId);
      setAllStudents(updatedStudents);
      setStudents(updatedStudents);
    }
  };

  if (loading) {
    return (
      <div className="student-search-container">
        <div className="loading-state">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Alunos" 
        onLogout={onLogout} 
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
          />
          
          <StudentsTable 
            students={students}
            onView={handleViewStudent}
            onDelete={handleDeleteStudent}
          />
        </main>
      </div>
    </div>
  );
};

export default BuscaAluno;