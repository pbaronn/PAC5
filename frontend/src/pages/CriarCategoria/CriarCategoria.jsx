import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Save, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import CategoriesSidebar from '../../components/CategoriesSidebar/CategoriesSidebar';
import { categoryService, studentService } from '../../services/api';
import './CriarCategoria.css';

const CriarCategoria = ({ onLogout, onNavigate }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6',
    idadeMinima: '',
    idadeMaxima: ''
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadAvailableStudents();
  }, []);

  const loadAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();
      
      // Agora mostra TODOS os alunos, não apenas os sem categoria
      // Pois cada aluno pode ter múltiplas categorias
      setAvailableStudents(response.students || []);
      
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setError('Erro ao carregar alunos disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      setError('Por favor, insira o nome da categoria.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Criar a categoria
      const response = await categoryService.create(formData);
      
      // Se há alunos selecionados, vincular eles à nova categoria
      if (selectedStudents.length > 0) {
        const studentIds = selectedStudents.map(student => student._id || student.id);
        
        await categoryService.addStudentsToCategory(response.category._id, studentIds);
      }

      showSuccessMessage(`Categoria "${formData.nome}" criada com sucesso!`);
      
      // Limpar formulário
      setFormData({ nome: '', descricao: '', cor: '#3B82F6', idadeMinima: '', idadeMaxima: '' });
      setSelectedStudents([]);
      
      // Recarregar alunos disponíveis
      await loadAvailableStudents();
      
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      setError(error.message || 'Erro ao criar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStudent = (student) => {
    if (!selectedStudents.find(s => (s._id || s.id) === (student._id || student.id))) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => (s._id || s.id) !== studentId));
  };

  const filteredStudents = availableStudents.filter(student =>
    (student.nomeAluno || student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedStudents.find(s => (s._id || s.id) === (student._id || student.id))
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
          <div className="panel-header">
            <h1 className="panel-title">Criar Nova Categoria</h1>
            <button 
              type="button" 
              className="back-btn"
              onClick={handleBack}
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
          
          {error && (
            <div className="error-message" style={{
              color: 'red',
              background: 'rgba(255,0,0,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid rgba(255,0,0,0.3)'
            }}>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="success-message" style={{
              color: 'green',
              background: 'rgba(0,255,0,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid rgba(0,255,0,0.3)'
            }}>
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
            
            <div className="form-group">
              <label htmlFor="idadeMinima">Idade Mínima</label>
              <input
                id="idadeMinima"
                name="idadeMinima"
                type="number"
                value={formData.idadeMinima}
                onChange={handleInputChange}
                placeholder="Ex: 13"
                className="form-input"
                min="0"
                max="100"
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="idadeMaxima">Idade Máxima</label>
              <input
                id="idadeMaxima"
                name="idadeMaxima"
                type="number"
                value={formData.idadeMaxima}
                onChange={handleInputChange}
                placeholder="Ex: 15"
                className="form-input"
                min="0"
                max="100"
                disabled={saving}
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
              <h3 className="subsection-title">Alunos Disponíveis ({filteredStudents.length})</h3>
              <div className="students-list">
                {filteredStudents.map((student) => (
                  <div key={student._id || student.id} className="student-item">
                    <div className="student-info">
                      <span className="student-name">{student.nomeAluno || student.name}</span>
                      <span className="student-details">
                        {student.cpf ? `CPF: ${student.cpf}` : 'Sem CPF'} • 
                        {student.telefone ? ` Tel: ${student.telefone}` : ' Sem telefone'}
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
                
                {filteredStudents.length === 0 && (
                  <div className="no-results">
                    <p>{searchTerm ? 'Nenhum aluno encontrado com este nome.' : 'Nenhum aluno cadastrado no sistema.'}</p>
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
                    <div key={student._id || student.id} className="selected-student-item">
                      <div className="student-info">
                        <span className="student-name">{student.nomeAluno || student.name}</span>
                        <span className="student-details">
                          {student.cpf ? `CPF: ${student.cpf}` : 'Sem CPF'} • 
                          {student.telefone ? ` Tel: ${student.telefone}` : ' Sem telefone'}
                        </span>
                      </div>
                      <button
                        className="remove-student-btn"
                        onClick={() => handleRemoveStudent(student._id || student.id)}
                        title="Remover aluno"
                        disabled={saving}
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
                  Salvar Categoria
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CriarCategoria;
