import React, { useState } from 'react';
import { Eye, Trash2, Edit } from 'lucide-react';
import './StudentsTable.css';

const StudentsTable = ({ students = [], onView, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && studentToDelete) {
      onDelete(studentToDelete.id);
    }
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleRowClick = (student) => {
    if (onView) {
      onView(student);
    }
  };

  const handleEditClick = (student, e) => {
    e.stopPropagation(); // Previne o clique na linha
    if (onEdit) {
      onEdit(student);
    }
  };

  if (!students.length) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>Nenhum aluno encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Aluno</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td onClick={() => handleRowClick(student)}>{student.id}</td>
                <td onClick={() => handleRowClick(student)}>{student.name}</td>
                <td onClick={() => handleRowClick(student)}>{student.category}</td>
                <td onClick={() => handleRowClick(student)}>
                  <span className={`table-status ${student.status?.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="table-action-btn view"
                      onClick={() => handleRowClick(student)}
                      title="Visualizar aluno"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="table-action-btn edit"
                      onClick={(e) => handleEditClick(student, e)}
                      title="Editar aluno"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="table-action-btn delete"
                      onClick={() => handleDeleteClick(student)}
                      title="Excluir aluno"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o aluno{' '}
              <strong>{studentToDelete?.name}</strong>?
            </p>
            <p className="delete-warning">
              Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
              <button 
                className="btn-delete" 
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsTable;