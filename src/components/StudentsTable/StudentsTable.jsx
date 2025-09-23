import React from 'react';
import './StudentsTable.css';

const StudentsTable = ({ students = [] }) => {
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
              <td>
                <span className={`table-status ${student.status?.toLowerCase()}`}>
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;