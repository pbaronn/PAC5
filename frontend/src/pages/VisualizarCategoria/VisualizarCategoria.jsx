import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Users, Trash2, X } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService } from '../../services/api';
import './VisualizarCategoria.css';

const VisualizarCategoria = ({ onLogout, onNavigate, categoryData: rawCategoryData }) => {
  console.log('VisualizarCategoria RENDERIZADO - rawCategoryData:', rawCategoryData);
  
  // Extrair dados corretos da estrutura (pode vir como {data: {...}} ou direto)
  const initialCategoryData = rawCategoryData?.data || rawCategoryData;
  console.log('VisualizarCategoria - initialCategoryData:', initialCategoryData);
  
  const [category, setCategory] = useState(initialCategoryData || null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    console.log('VisualizarCategoria useEffect - initialCategoryData:', initialCategoryData);
    if (initialCategoryData && initialCategoryData._id) {
      setCategory(initialCategoryData);
      loadCategoryDetails(initialCategoryData._id);
    } else {
      setError('Nenhuma categoria selecionada');
      setLoading(false);
    }
  }, [rawCategoryData]);

  const loadCategoryDetails = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('loadCategoryDetails - Buscando categoria ID:', categoryId);
      
      // Buscar dados atualizados da categoria
      const categoryResponse = await categoryService.getById(categoryId);
      console.log('loadCategoryDetails - categoryResponse:', categoryResponse);
      
      // Extrair dados da resposta (pode vir como {data: {...}} ou {success: true, data: {...}})
      const categoryData = categoryResponse.data || categoryResponse;
      console.log('loadCategoryDetails - categoryData extraído:', categoryData);
      console.log('loadCategoryDetails - campo ativo:', categoryData.ativo);
      console.log('loadCategoryDetails - totalAlunos:', categoryData.totalAlunos);
      
      setCategory(categoryData);

      // Buscar alunos da categoria
      const studentsResponse = await categoryService.getStudents(categoryId);
      console.log('loadCategoryDetails - studentsResponse:', studentsResponse);
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
      await loadCategoryDetails(category._id); // Recarregar dados
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

  // Só renderizar se temos uma categoria válida
  if (!category || !category._id) {
    return (
      <div className="student-search-container">
        <Header 
          activeNav="Categorias" 
          onLogout={onLogout} 
          onNavigate={onNavigate}
        />
        <div className="error-state">
          <p>Categoria não encontrada</p>
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
            {console.log('RENDERIZANDO - category:', category)}
            {console.log('RENDERIZANDO - category.ativo:', category.ativo)}
            {console.log('RENDERIZANDO - category.totalAlunos:', category.totalAlunos)}
            {console.log('RENDERIZANDO - category.nome:', category.nome)}
            
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

              {category.idadeMinima && (
                <div className="info-item">
                  <label>Idade Mínima:</label>
                  <span>{category.idadeMinima} anos</span>
                </div>
              )}

              {category.idadeMaxima && (
                <div className="info-item">
                  <label>Idade Máxima:</label>
                  <span>{category.idadeMaxima} anos</span>
                </div>
              )}

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
