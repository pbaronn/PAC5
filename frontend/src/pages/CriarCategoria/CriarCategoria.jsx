import React, { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import './CriarCategoria.css';

const CriarCategoria = ({ onLogout, onNavigate }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Dados mockados para alunos disponíveis
  const mockStudents = [
    { id: 1, name: 'João Silva', age: 12, position: 'Atacante' },
    { id: 2, name: 'Maria Santos', age: 11, position: 'Meio-campo' },
    { id: 3, name: 'Pedro Costa', age: 13, position: 'Defensor' },
    { id: 4, name: 'Ana Oliveira', age: 10, position: 'Goleiro' },
    { id: 5, name: 'Carlos Lima', age: 12, position: 'Atacante' },
    { id: 6, name: 'Fernanda Souza', age: 11, position: 'Meio-campo' },
    { id: 7, name: 'Rafael Mendes', age: 13, position: 'Defensor' },
    { id: 8, name: 'Juliana Alves', age: 10, position: 'Goleiro' },
    { id: 9, name: 'Lucas Ferreira', age: 12, position: 'Atacante' },
    { id: 10, name: 'Camila Rodrigues', age: 11, position: 'Meio-campo' }
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      setAvailableStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('menu-categorias');
    }
  };

  const handleSave = () => {
    if (!categoryName.trim()) {
      alert('Por favor, insira o nome da categoria.');
      return;
    }

    const categoryData = {
      name: categoryName,
      students: selectedStudents
    };

    console.log('Categoria criada:', categoryData);
    alert('Categoria criada com sucesso!');
    
    if (onNavigate) {
      onNavigate('menu-categorias');
    }
  };

  const handleAddStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
  };

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedStudents.find(s => s.id === student.id)
  );

  if (loading) {
    return (
      <div className="student-search-container">
        <Header 
          activeNav="Categorias" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando alunos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Categorias" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <CategoriesSidebar 
          activeItem="Adicionar Categoria" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Criar Nova Categoria</h1>
          
          {/* Formulário da categoria */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="categoryName">Nome da Categoria</label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ex: Sub-12"
                className="form-input"
              />
            </div>
          </div>

          {/* Seção de adicionar alunos */}
          <div className="form-section">
            <h2 className="section-title">Adicionar Alunos</h2>
            
            {/* Busca de alunos */}
            <div className="search-container-centered">
              <input
                type="text"
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-centered"
              />
              <Search size={20} className="search-icon-centered" />
            </div>

            {/* Lista de alunos disponíveis */}
            <div className="students-container">
              <h3 className="subsection-title">Alunos Disponíveis</h3>
              <div className="students-list">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="student-item">
                    <div className="student-info">
                      <span className="student-name">{student.name}</span>
                      <span className="student-details">{student.age} anos • {student.position}</span>
                    </div>
                    <button
                      className="add-student-btn"
                      onClick={() => handleAddStudent(student)}
                      title="Adicionar aluno"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
                
                {filteredStudents.length === 0 && (
                  <div className="no-results">
                    <p>Nenhum aluno encontrado.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de alunos selecionados */}
            {selectedStudents.length > 0 && (
              <div className="selected-students-container">
                <h3 className="subsection-title">Alunos Selecionados ({selectedStudents.length})</h3>
                <div className="selected-students-list">
                  {selectedStudents.map((student) => (
                    <div key={student.id} className="selected-student-item">
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-details">{student.age} anos • {student.position}</span>
                      </div>
                      <button
                        className="remove-student-btn"
                        onClick={() => handleRemoveStudent(student.id)}
                        title="Remover aluno"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="form-actions">
            <button className="cancel-btn" onClick={handleBack}>
              Cancelar
            </button>
            <button className="save-btn" onClick={handleSave}>
              Salvar Categoria
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CriarCategoria;
