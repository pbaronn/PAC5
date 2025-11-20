import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Search } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService, studentService } from '../../services/api';
import './EditarCategoria.css';

const EditarCategoria = ({ onLogout, onNavigate, categoryData }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6'
  });
  const [currentStudents, setCurrentStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentsToAdd, setStudentsToAdd] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (categoryData && categoryData._id) {
      loadData();
    } else {
      setError('Nenhuma categoria selecionada');
      setLoading(false);
    }
  }, [categoryData]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar dados da categoria
      const categoryResponse = await categoryService.getById(categoryData._id);
      setFormData({
        nome: categoryResponse.nome || '',
        descricao: categoryResponse.descricao || '',
        cor: categoryResponse.cor || '#3B82F6'
      });

      // Carregar alunos da categoria
      const studentsResponse = await categoryService.getStudents(categoryData._id);
      setCurrentStudents(studentsResponse.students || []);

      // Carregar todos os alunos para poder adicionar
      const allStudentsResponse = await studentService.getAll();
      setAvailableStudents(allStudentsResponse.students || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados: ' + error.message);
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

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudent = (student) => {
    // Verificar se o aluno já está na categoria
    const isAlreadyInCategory = currentStudents.some(s => s._id === student._id);
    // Verificar se o aluno já está na lista para adicionar
    const isAlreadyToAdd = studentsToAdd.some(s => s._id === student._id);

    if (!isAlreadyInCategory && !isAlreadyToAdd) {
      setStudentsToAdd([...studentsToAdd, student]);
    }
  };

  const handleRemoveFromToAdd = (studentId) => {
    setStudentsToAdd(studentsToAdd.filter(s => s._id !== studentId));
  };

  const handleRemoveFromCategory = async (studentId) => {
    if (!window.confirm('Tem certeza que deseja remover este aluno da categoria?')) {
      return;
    }

    try {
      await categoryService.removeStudentFromCategory(categoryData._id, studentId);
      setCurrentStudents(currentStudents.filter(s => s._id !== studentId));
      showSuccessMessage('Aluno removido da categoria!');
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      setError('Erro ao remover aluno: ' + error.message);
    }
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      setError('Por favor, insira o nome da categoria.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Atualizar informações básicas da categoria
      await categoryService.update(categoryData._id, formData);

      // Adicionar novos alunos se houver
      if (studentsToAdd.length > 0) {
        const studentIds = studentsToAdd.map(s => s._id);
        await categoryService.addStudentsToCategory(categoryData._id, studentIds);
      }

      showSuccessMessage('Categoria atualizada com sucesso!');

      // Recarregar dados
      setTimeout(async () => {
        await loadData();
        setStudentsToAdd([]);
      }, 1500);

    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      setError(error.message || 'Erro ao atualizar categoria');
    } finally {
      setSaving(false);
    }
  };

  const filteredAvailableStudents = availableStudents.filter(student => {
    const matchesSearch = (student.nomeAluno || '').toLowerCase().includes(searchTerm.toLowerCase());
    const notInCategory = !currentStudents.some(s => s._id === student._id);
    const notInToAdd = !studentsToAdd.some(s => s._id === student._id);
    return matchesSearch && notInCategory && notInToAdd;
  });

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
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error && !categoryData) {
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
            <h1 className="panel-title">Editar Categoria</h1>
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft size={16} />
              Voltar
            </button>
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

          {/* Formulário da categoria */}
          <div className="form-section">
            <h2 className="section-title">Informações da Categoria</h2>
            
            <div className="form-group">
              <label htmlFor="nome">Nome da Categoria *</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Sub-12"
                className="form-input"
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descrição opcional da categoria..."
                className="form-input"
                rows={3}
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cor">Cor da Categoria</label>
              <div className="color-input-group">
                <input
                  id="cor"
                  name="cor"
                  type="color"
                  value={formData.cor}
                  onChange={handleInputChange}
                  className="color-input"
                  disabled={saving}
                />
                <span className="color-preview" style={{ backgroundColor: formData.cor }}></span>
              </div>
            </div>
          </div>

          {/* Alunos atuais */}
          <div className="form-section">
            <h2 className="section-title">Alunos na Categoria ({currentStudents.length})</h2>
            
            {currentStudents.length > 0 ? (
              <div className="students-list">
                {currentStudents.map((student) => (
                  <div key={student._id} className="student-item selected">
                    <div className="student-info">
                      <span className="student-name">{student.nomeAluno}</span>
                      <span className="student-details">
                        {student.cpf && `CPF: ${student.cpf}`}
                        {student.telefone && ` • Tel: ${student.telefone}`}
                      </span>
                      {student.categories && student.categories.length > 1 && (
                        <span className="student-categories">
                          Também em: {student.categories.filter(cat => cat !== formData.nome).join(', ')}
                        </span>
                      )}
                    </div>
                    <button
                      className="remove-student-btn"
                      onClick={() => handleRemoveFromCategory(student._id)}
                      title="Remover aluno"
                      disabled={saving}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>Nenhum aluno vinculado a esta categoria.</p>
              </div>
            )}
          </div>

          {/* Adicionar novos alunos */}
          <div className="form-section">
            <h2 className="section-title">Adicionar Alunos</h2>
            
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

            {/* Alunos selecionados para adicionar */}
            {studentsToAdd.length > 0 && (
              <div className="selected-students-container">
                <h3 className="subsection-title">Alunos Selecionados para Adicionar ({studentsToAdd.length})</h3>
                <div className="selected-students-list">
                  {studentsToAdd.map((student) => (
                    <div key={student._id} className="student-item to-add">
                      <div className="student-info">
                        <span className="student-name">{student.nomeAluno}</span>
                        <span className="student-details">
                          {student.cpf && `CPF: ${student.cpf}`}
                          {student.telefone && ` • Tel: ${student.telefone}`}
                        </span>
                      </div>
                      <button
                        className="remove-student-btn"
                        onClick={() => handleRemoveFromToAdd(student._id)}
                        title="Remover da seleção"
                        disabled={saving}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de alunos disponíveis */}
            <div className="students-container">
              <h3 className="subsection-title">Alunos Disponíveis ({filteredAvailableStudents.length})</h3>
              <div className="students-list">
                {filteredAvailableStudents.map((student) => (
                  <div key={student._id} className="student-item">
                    <div className="student-info">
                      <span className="student-name">{student.nomeAluno}</span>
                      <span className="student-details">
                        {student.cpf && `CPF: ${student.cpf}`}
                        {student.telefone && ` • Tel: ${student.telefone}`}
                      </span>
                    </div>
                    <button
                      className="add-student-btn"
                      onClick={() => handleAddStudent(student)}
                      title="Adicionar aluno"
                      disabled={saving}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
                
                {filteredAvailableStudents.length === 0 && (
                  <div className="no-results">
                    <p>{searchTerm ? 'Nenhum aluno encontrado.' : 'Todos os alunos já estão nesta categoria.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="form-actions">
            <button 
              className="cancel-btn" 
              onClick={handleBack}
              disabled={saving}
            >
              Cancelar
            </button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={saving || !formData.nome.trim()}
            >
              {saving ? (
                <>
                  <div className="spinner"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditarCategoria;
