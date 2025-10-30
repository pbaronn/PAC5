const express = require('express');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getCategories,
  removeCategoryFromAllStudents
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas sem autenticação (temporário para desenvolvimento)
router.post('/', createStudent);                          // Criar aluno
router.get('/categories', getCategories);                 // Categorias (deve vir antes de /:id)
router.delete('/categories/remove-all', removeCategoryFromAllStudents); // Remover categoria de todos
router.get('/', getStudents);                             // Listar alunos
router.get('/:id', getStudentById);                       // Buscar aluno por ID
router.put('/:id', updateStudent);                        // Atualizar aluno 
router.delete('/:id', deleteStudent);                     // Deletar aluno

// Rotas que precisam de autenticação
router.use(authMiddleware);

module.exports = router;