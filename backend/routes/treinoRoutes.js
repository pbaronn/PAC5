const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTreino,
  getTreinos,
  getTreinoById,
  updateTreino,
  deleteTreino,
  toggleTreinoStatus,
  getAlunosByTreino,
  getTreinosByCategoria,
  getTreinoStatistics
} = require('../controllers/treinoController');
const authMiddleware = require('../middleware/authMiddleware');

// Validações
const treinoValidation = [
  body('categoria')
    .trim()
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  
  body('diasSemana')
    .isArray({ min: 1 })
    .withMessage('Deve haver pelo menos um dia da semana selecionado')
    .custom(value => {
      const diasValidos = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
      return value.every(dia => diasValidos.includes(dia));
    })
    .withMessage('Um ou mais dias da semana são inválidos'),
  
  body('horarioInicio')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário de início deve estar no formato HH:MM'),
  
  body('horarioFim')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário de fim deve estar no formato HH:MM'),
  
  body('local')
    .trim()
    .notEmpty()
    .withMessage('Local é obrigatório')
    .isLength({ max: 200 })
    .withMessage('Local deve ter no máximo 200 caracteres'),
  
  body('tecnico')
    .trim()
    .notEmpty()
    .withMessage('Técnico responsável é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome do técnico deve ter no máximo 100 caracteres'),
  
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres')
];

// Rotas

// @route   GET /api/treinos/statistics
// @desc    Obter estatísticas dos treinos
// @access  Private
router.get('/statistics', authMiddleware, getTreinoStatistics);

// @route   GET /api/treinos/categoria/:categoria
// @desc    Obter treinos por categoria
// @access  Private
router.get('/categoria/:categoria', authMiddleware, getTreinosByCategoria);

// @route   GET /api/treinos
// @desc    Listar todos os treinos
// @access  Private
router.get('/', authMiddleware, getTreinos);

// @route   POST /api/treinos
// @desc    Criar um novo treino
// @access  Private
router.post('/', authMiddleware, treinoValidation, createTreino);

// @route   GET /api/treinos/:id
// @desc    Obter treino por ID
// @access  Private
router.get('/:id', authMiddleware, getTreinoById);

// @route   PUT /api/treinos/:id
// @desc    Atualizar treino
// @access  Private
router.put('/:id', authMiddleware, treinoValidation, updateTreino);

// @route   DELETE /api/treinos/:id
// @desc    Deletar treino
// @access  Private
router.delete('/:id', authMiddleware, deleteTreino);

// @route   PATCH /api/treinos/:id/toggle
// @desc    Desativar/Ativar treino
// @access  Private
router.patch('/:id/toggle', authMiddleware, toggleTreinoStatus);

// @route   GET /api/treinos/:id/alunos
// @desc    Obter alunos da categoria do treino
// @access  Private
router.get('/:id/alunos', authMiddleware, getAlunosByTreino);

module.exports = router;
