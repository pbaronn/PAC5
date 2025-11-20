import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Users, Trash2, X } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService } from '../../services/api';
import './VisualizarCategoria.css';

const VisualizarCategoria = ({ onLogout, onNavigate, categoryData }) => {
  const [category, setCategory] = useState(categoryData || null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (categoryData && categoryData._id) {
      loadCategoryDetails();
    } else {
      setError('Nenhuma categoria selecionada');
      setLoading(false);
    }
  }, [categoryData]);

  const loadCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados atualizados da categoria
      const categoryResponse = await categoryService.getById(category._id);
      setCategory(categoryResponse);

      // Buscar alunos da categoria
      const studentsResponse = await categoryService.getStudents(category._id);
      setStudents(studentsResponse.students || []);
    } catch (error) {
      console.error('Erro ao carregar detalhes da categoria:', error);
      setError('Erro ao carregar detalhes da categoria: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('menu-categorias');
    }
  };

  const handleEdit = () => {
    if (onNavigate) {
      onNavigate('editar-categoria', { categoryData: category });
    }
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Tem certeza que deseja remover este aluno da categoria?')) {
      return;
    }

    try {
      await categoryService.removeStudentFromCategory(category._id, studentId);
      showSuccessMessage('Aluno removido da categoria com sucesso!');
      await loadCategoryDetails(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      setError('Erro ao remover aluno: ' + error.message);
    }
  };

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
          <p>Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="student-search-container">
        <Header 
          activeNav="Categorias" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="error-state">
          <p>{error}</p>
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={16} />
            Voltar
          </button>
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
          <div className="panel-header">
            <h1 className="panel-title">Visualizar Categoria</h1>
            <div className="header-actions">
              <button className="edit-btn" onClick={handleEdit}>
                <Edit size={16} />
                Editar
              </button>
              <button className="back-btn" onClick={handleBack}>
                <ArrowLeft size={16} />
                Voltar
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {/* Informações da categoria */}
          <div className="info-section">
            <div className="info-header">
              <div 
                className="category-color-display" 
                style={{ backgroundColor: category.cor || '#3B82F6' }}
              ></div>
              <h2 className="category-name-display">{category.nome}</h2>
            </div>

              <div className="info-item full-width">
                <label>Total de Alunos:</label>
                <span className="stat-value">{category.totalAlunos || 0}</span>
              </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Nome:</label>
                <span>{category.nome}</span>
              </div>

              {category.descricao && (
                <div className="info-item">
                  <label>Descrição:</label>
                  <span>{category.descricao}</span>
                </div>
              )}

              <div className="info-item">
                <label>Cor:</label>
                <div className="color-display">
                  <div 
                    className="color-box" 
                    style={{ backgroundColor: category.cor || '#3B82F6' }}
                  ></div>
                  <span>{category.cor || '#3B82F6'}</span>
                </div>
              </div>

              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${category.ativo ? 'active' : 'inactive'}`}>
                  {category.ativo ? 'Ativa' : 'Inativa'}
                </span>
              </div>

            </div>
          </div>

          {/* Lista de alunos */}
          <div className="students-section">
            <div className="section-header">
              <h3 className="section-title">
                <Users size={20} />
                Alunos Vinculados ({students.length})
              </h3>
            </div>

            {students.length > 0 ? (
              <div className="students-list">
                {students.map((student) => (
                  <div key={student._id} className="student-card">
                    <div className="student-info">
                      <div className="student-name">{student.nomeAluno}</div>
                      <div className="student-details">
                        {student.cpf && `CPF: ${student.cpf}`}
                        {student.telefone && ` • Tel: ${student.telefone}`}
                      </div>
                      {student.categories && student.categories.length > 1 && (
                        <div className="student-categories">
                          Também em: {student.categories.filter(cat => cat !== category.nome).join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      className="remove-student-btn"
                      onClick={() => handleRemoveStudent(student._id)}
                      title="Remover aluno da categoria"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-students">
                <Users size={48} className="empty-icon" />
                <p>Nenhum aluno vinculado a esta categoria.</p>
                <button className="edit-btn" onClick={handleEdit}>
                  <Edit size={16} />
                  Adicionar Alunos
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualizarCategoria;
