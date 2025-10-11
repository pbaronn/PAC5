import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Edit, Save, XCircle, Trash2 } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import './VisualizarCategoria.css';

const VisualizarCategoria = ({ onLogout, onNavigate, categoryData }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados para alunos disponíveis
  const mockStudents = [
    { id: 1, name: 'João Silva', age: 12, position: 'Atacante' },
    { id: 2, name: 'Maria Santos', age: 11, position: 'Meio-campo' },
    { id: 3, name: 'Pedro Costa', age: 13, position: 'Defensor' },
    { id: 4, name: 'Ana Oliveira', age: 10, position: 'Goleiro' },
    { id: 5, name: 'Carlos Lima', age: 12, position: 'Atacante' },
    { id: 6, name: 'Fernanda Souza', age: 11, position: 'Meio-campo' },
    { id: 7, name: 'Rafael Mendes', age: 13, position: 'Defensor' },
    { id: 8, name: 'Juliana Alves', age: 10, position: 'Goleiro' }
  ];

  // Dados mockados para alunos da categoria
  const mockCategoryStudents = [
    { id: 1, name: 'João Silva', age: 12, position: 'Atacante' },
    { id: 2, name: 'Maria Santos', age: 11, position: 'Meio-campo' },
    { id: 3, name: 'Pedro Costa', age: 13, position: 'Defensor' }
  ];

  useEffect(() => {
    // Simula carregamento dos dados
    setTimeout(() => {
      const currentCategory = categoryData || { name: 'Sub-12', description: 'Categoria para jogadores de 12 anos' };
      setCategory(currentCategory);
      setFormData({
        name: currentCategory.name || '',
        description: currentCategory.description || ''
      });
      setSelectedStudents(mockCategoryStudents);
      setAvailableStudents(mockStudents.filter(student => 
        !mockCategoryStudents.find(catStudent => catStudent.id === student.id)
      ));
      setLoading(false);
    }, 500);
  }, [categoryData]);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    if (!editMode) {
      // Ao entrar no modo de edição, mantém os dados atuais
      setFormData({
        name: category?.name || '',
        description: category?.description || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Por favor, insira o nome da categoria.');
      return;
    }

    const updatedCategory = {
      ...category,
      name: formData.name,
      description: formData.description,
      students: selectedStudents
    };

    console.log('Categoria atualizada:', updatedCategory);
    alert('Categoria atualizada com sucesso!');
    
    setCategory(updatedCategory);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    // Restaura os dados originais
    setFormData({
      name: category?.name || '',
      description: category?.description || ''
    });
    setEditMode(false);
  };

  const handleDeleteCategory = () => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${category?.name}"? Esta ação não pode ser desfeita.`)) {
      console.log('Excluindo categoria:', category);
      alert('Categoria excluída com sucesso!');
      // Volta para o menu de categorias após excluir
      if (onNavigate) {
        onNavigate('menu-categorias');
      }
    }
  };

  const handleAddStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
      setAvailableStudents(availableStudents.filter(s => s.id !== student.id));
    }
  };

  const handleRemoveStudent = (studentId) => {
    const studentToRemove = selectedStudents.find(s => s.id === studentId);
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
    if (studentToRemove) {
      setAvailableStudents([...availableStudents, studentToRemove]);
    }
  };

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p>Carregando categoria...</p>
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
          activeItem="Categorias" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <div className="view-header">
            <h1 className="panel-title">Visualizar Categoria</h1>
            
            <div className="view-actions">
              {!editMode ? (
                <div className="view-mode-actions">
                  <button 
                    className="edit-btn"
                    onClick={handleEditToggle}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={handleDeleteCategory}
                  >
                    <Trash2 size={18} />
                    Excluir Categoria
                  </button>
                </div>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSave}
                  >
                    <Save size={18} />
                    Salvar
                  </button>
                  <button 
                    className="cancel-edit-btn"
                    onClick={handleCancelEdit}
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Informações da categoria */}
          <div className="form-section">
            <h2 className="section-title">Informações da Categoria</h2>
            
            <div className="form-group">
              <label htmlFor="categoryName">Nome da Categoria</label>
              <input
                id="categoryName"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                readOnly={!editMode}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryDescription">Descrição</label>
              <textarea
                id="categoryDescription"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                readOnly={!editMode}
                className="form-textarea"
                rows="3"
                placeholder="Descrição da categoria..."
              />
            </div>
          </div>

          {/* Alunos da categoria */}
          <div className="form-section">
            <h2 className="section-title">Alunos da Categoria ({selectedStudents.length})</h2>
            
            {editMode && (
              <>
                {/* Busca de alunos */}
                <div className="search-container">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar alunos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    readOnly={false}
                  />
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
              </>
            )}

            {/* Lista de alunos da categoria */}
            <div className="selected-students-container">
              <h3 className="subsection-title">Alunos da Categoria</h3>
              <div className="selected-students-list">
                {selectedStudents.map((student) => (
                  <div key={student.id} className="selected-student-item">
                    <div className="student-info">
                      <span className="student-name">{student.name}</span>
                      <span className="student-details">{student.age} anos • {student.position}</span>
                    </div>
                    {editMode && (
                      <button
                        className="remove-student-btn"
                        onClick={() => handleRemoveStudent(student.id)}
                        title="Remover aluno"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                
                {selectedStudents.length === 0 && (
                  <div className="no-results">
                    <p>Nenhum aluno cadastrado nesta categoria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualizarCategoria;
