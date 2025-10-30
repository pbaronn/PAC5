import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import StudentsTable from '../../components/StudentsTable/StudentsTable';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { studentService } from '../../services/api';
import './BuscaAluno.css';

const BuscaAluno = ({ onLogout, onNavigate, onDeleteStudent }) => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Estados para modal de confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Função para mostrar mensagem de sucesso temporária
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Função para buscar alunos do backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando alunos do backend...');
      const response = await studentService.getAll();
      
      console.log('Alunos recebidos:', response);
      
      // Normalizar dados para compatibilidade com o componente existente
      const normalizedStudents = response.students.map(student => ({
        id: student._id,
        name: student.nomeAluno,
        category: student.category,
        status: student.status,
        // Manter todos os dados originais também (incluindo a data original)
        ...student,
        // Garantir que a data esteja preservada
        dataNascimento: student.dataNascimento
      }));
      
      setAllStudents(normalizedStudents);
      setStudents(normalizedStudents);
      
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setError(error.message || 'Erro ao carregar alunos');
      
      // Fallback para dados vazios em caso de erro
      setAllStudents([]);
      setStudents([]);
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

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      // Usar _id (ID do MongoDB) em vez de id normalizado
      const studentId = studentToDelete._id || studentToDelete.id;
      console.log('Deletando aluno com ID:', studentId);
      
      if (!studentId) {
        throw new Error('ID do aluno não encontrado');
      }
      
      await studentService.delete(studentId);
      
      // Recarregar a lista do servidor para garantir dados atualizados
      await fetchStudents();
      
      console.log('Aluno deletado com sucesso');
      
      // Mostrar mensagem de sucesso
      setError(null);
      showSuccessMessage(`Aluno "${studentToDelete.name || studentToDelete.nomeAluno}" foi excluído com sucesso!`);
      
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      setError('Erro ao deletar aluno: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setStudentToDelete(null);
      setShowDeleteModal(false);
    }
  };

  

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
          
          {loading ? (
            <div className="loading-message" style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              Carregando alunos...
            </div>
          ) : (
            <>
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
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            </>
          )}
        </main>
      </div>
      
      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setStudentToDelete(null);
        }}
        onConfirm={confirmDeleteStudent}
        title="Excluir Aluno"
        message={`Tem certeza que deseja excluir o aluno "${studentToDelete?.name || studentToDelete?.nomeAluno}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default BuscaAluno;