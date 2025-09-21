import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  User,
  Users,
  Filter,
  X,
  LogOut
} from 'lucide-react';
import './BuscaAluno.css';

// importar imagens do diretório public
const imagemJEC = '/img/brasao.png';
const imagemAlunos = '/img/icon_jogador.png';
const imagemCategorias = '/img/icon-categoria.png';
const imagemJogos = '/img/icon_jogos.png';
const imagemTreinos = '/img/icon_treinos.png';
const imagemConfiguracoes = '/img/icon_configurações.png';

const BuscaAluno = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);


  const API_URL = 'http://localhost:3001/api/students';

  // Função para buscar os dados da API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
      }
      const data = await response.json();
      setAllStudents(data);
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // UseEffect para filtrar os alunos
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

  if (loading) {
    return <div className="loading-state">Carregando dados...</div>;
  }

  return (
    <div className="student-search-container">
      <header className="header">
        <div className="logo">
          <img src={imagemJEC} alt="Brasão do Clube" className="logo-image" />
        </div>

        
        <nav className="main-nav">
          <div className="nav-item active">
            <div className="nav-icon"><img src={imagemAlunos} alt="Ícone de alunos" /></div>
            <span>Alunos</span>
          </div>

          
          <div className="nav-item">
            <div className="nav-icon"><img src={imagemCategorias} alt="Ícone de categorias" /></div>
            <span>Categorias</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon"><img src={imagemJogos} alt="Ícone de jogos" /></div>
            <span>Jogos</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon"><img src={imagemTreinos} alt="Ícone de treinos" /></div>
            <span>Treinos</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon"><img src={imagemConfiguracoes} alt="Ícone de configurações" /></div>
            <span>Configurações</span>
          </div>
        </nav>
        <button className="exit-btn">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </header>


      <div className="main-content">
         <aside className="sidebar">
          <div className="sidebar-item active">
            <div className="sidebar-icon">
              <User size={24} />
            </div>
            <span>Cadastrar Aluno</span>
          </div>
          <div className="sidebar-item">
            <div className="sidebar-icon">
              <Users size={24} />
            </div>
            <span>Buscar Aluno</span>
          </div>
        </aside>



        <main className="main-panel">
          <h1 className="panel-title">Atletas Cadastrados</h1>
          <div className="search-filters">
            <div className="filter-group">
              <label className="filter-label">Categoria:</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas as Categorias</option>
                <option value="Sub-5">Sub-5</option>
                <option value="Sub-6">Sub-6</option>
                <option value="Sub-7">Sub-7</option>
                <option value="Sub-8">Sub-8</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Aluno:</label>
              <input
                type="text"
                className="filter-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Digite o nome do aluno"
              />
            </div>
            <div className="filter-buttons">
              <button className="search-btn" onClick={() => {}}>
                <Search size={16} />
                Buscar
              </button>
              <button className="clear-btn" onClick={handleClear}>
                <X size={16} />
                Limpar
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Aluno</th>
                  <th>Categoria</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.category}</td>
                    <td>{student.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuscaAluno;
