import React from 'react';
import { Eye, Trash2, Edit } from 'lucide-react';
import './StudentsTable.css';

const StudentsTable = ({ students = [], onView, onEdit, onDelete }) => {
  const handleDeleteClick = (student) => {
    if (onDelete) {
      onDelete(student);
    }
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

  const formatCategories = (student) => {
    // Priorizar o array categories se existir e não estiver vazio
    if (student.categories && Array.isArray(student.categories) && student.categories.length > 0) {
      return student.categories.join(', ');
    }
    // Fallback para category (campo legado)
    if (student.category) {
      return student.category;
    }
    return 'Sem categoria';
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
    <div className="table-container">
      <table className="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Aluno</th>
            <th>Categorias</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td onClick={() => handleRowClick(student)}>{student.id}</td>
              <td onClick={() => handleRowClick(student)}>{student.name}</td>
              <td onClick={() => handleRowClick(student)}>
                <span className="categories-cell">{formatCategories(student)}</span>
              </td>
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
  );
};

export default StudentsTable;