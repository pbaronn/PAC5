const express = require('express');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getCategories
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// Rotas CRUD para estudantes
router.post('/', createStudent);           // Linha 15
router.get('/', getStudents);              // Linha 16
router.get('/categories', getCategories);  // Linha 17 ← PROVÁVEL PROBLEMA
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;