import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import StudentsTable from '../../components/StudentsTable/StudentsTable';
import './BuscaAluno.css';

const BuscaAluno = ({ onLogout, onNavigate }) => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);

  // Dados mockados para teste (remova quando tiver API real)
  const mockStudents = [
    { id: 1, name: 'João Silva', category: 'Sub-7', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', category: 'Sub-6', status: 'Ativo' },
    { id: 3, name: 'Pedro Oliveira', category: 'Sub-8', status: 'Inativo' },
    { id: 4, name: 'Ana Costa', category: 'Sub-5', status: 'Ativo' },
    { id: 5, name: 'Carlos Ferreira', category: 'Sub-7', status: 'Ativo' }
  ];

  const API_URL = 'http://localhost:3001/api/students';

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Tenta buscar da API, se falhar usa dados mockados
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
      }
      const data = await response.json();
      setAllStudents(data);
      setStudents(data);
    } catch (error) {
      console.error('Erro ao buscar da API, usando dados mockados:', error);
      // Usa dados mockados se a API não estiver disponível
      setAllStudents(mockStudents);
      setStudents(mockStudents);
    } finally {
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
          activeItem="Buscar Aluno" 
          onItemClick={handleSidebarClick} 
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Atletas Cadastrados</h1>
          
          <SearchFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            studentName={studentName}
            setStudentName={setStudentName}
            onClear={handleClear}
          />
          
          <StudentsTable students={students} />
        </main>
      </div>
    </div>
  );
};

export default BuscaAluno;