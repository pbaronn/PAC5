const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryStudents,
  addStudentsToCategory,
  removeStudentFromCategory
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas sem autenticação (temporário para desenvolvimento)
router.post('/', createCategory);                           // Criar categoria
router.get('/', getCategories);                             // Listar categorias
router.get('/:id', getCategoryById);                        // Buscar categoria por ID
router.put('/:id', updateCategory);                         // Atualizar categoria
router.delete('/:id', deleteCategory);                      // Deletar categoria
router.patch('/:id/toggle', toggleCategoryStatus);          // Ativar/Desativar categoria
router.get('/:id/students', getCategoryStudents);           // Listar alunos da categoria
router.post('/:id/students', addStudentsToCategory);        // Vincular alunos à categoria
router.delete('/:id/students/:studentId', removeStudentFromCategory); // Desvincular aluno

// Rotas que precisam de autenticação
router.use(authMiddleware);
// (Adicionar rotas que precisam de auth quando necessário)

module.exports = router;