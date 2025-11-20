const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  addStudentToEscalacao,
  removeStudentFromEscalacao,
  getStudentsByCategory,
  finalizarJogo,
  getGameStatistics,
  cancelarJogo
} = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

// Validações
const gameValidation = [
  body('time1')
    .trim()
    .notEmpty()
    .withMessage('Time 1 é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome do time deve ter no máximo 100 caracteres'),
  
  body('time2')
    .trim()
    .notEmpty()
    .withMessage('Time 2 é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome do time deve ter no máximo 100 caracteres'),
  
  body('dataJogo')
    .isISO8601()
    .withMessage('Data do jogo deve estar no formato válido (YYYY-MM-DD)')
    .custom(value => {
      const date = new Date(value);
      if (date < new Date('2000-01-01')) {
        throw new Error('Data do jogo deve ser posterior a 2000');
      }
      return true;
    }),
  
  body('horario')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário deve estar no formato HH:MM'),
  
  body('local')
    .trim()
    .notEmpty()
    .withMessage('Local é obrigatório')
    .isLength({ max: 200 })
    .withMessage('Local deve ter no máximo 200 caracteres'),
  
  body('cep')
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve estar no formato 00000-000'),
  
  body('cidade')
    .trim()
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ max: 100 })
    .withMessage('Cidade deve ter no máximo 100 caracteres'),
  
  body('uf')
    .trim()
    .notEmpty()
    .withMessage('UF é obrigatória')
    .isLength({ min: 2, max: 2 })
    .withMessage('UF deve ter exatamente 2 caracteres')
    .isAlpha()
    .withMessage('UF deve conter apenas letras'),
  
  body('tipo')
    .isIn(['amistoso', 'campeonato', 'torneio', 'copa', 'festival', 'treino'])
    .withMessage('Tipo deve ser: amistoso, campeonato, torneio, copa, festival ou treino'),
  
  body('categoria')
    .trim()
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  
  body('juiz')
    .trim()
    .notEmpty()
    .withMessage('Juiz é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome do juiz deve ter no máximo 100 caracteres'),
  
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres'),
  
  body('escalacao')
    .optional()
    .isArray()
    .withMessage('Escalação deve ser um array')
];

const finalizarJogoValidation = [
  body('golsTime1')
    .isInt({ min: 0 })
    .withMessage('Gols do Time 1 deve ser um número inteiro não negativo'),
  
  body('golsTime2')
    .isInt({ min: 0 })
    .withMessage('Gols do Time 2 deve ser um número inteiro não negativo'),
  
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres')
];

// Rotas

// @route   GET /api/games/students/:categoria
// @desc    Obter alunos disponíveis para escalação por categoria
// @access  Private
router.get('/students/:categoria', authMiddleware, getStudentsByCategory);

// @route   GET /api/games
// @desc    Listar todos os jogos
// @access  Private
router.get('/', authMiddleware, getGames);

// @route   POST /api/games
// @desc    Criar um novo jogo
// @access  Private
router.post('/', authMiddleware, gameValidation, createGame);

// @route   GET /api/games/:id
// @desc    Obter jogo por ID
// @access  Private
router.get('/:id', authMiddleware, getGameById);

// @route   PUT /api/games/:id
// @desc    Atualizar jogo
// @access  Private
router.put('/:id', authMiddleware, gameValidation, updateGame);

// @route   DELETE /api/games/:id
// @desc    Deletar jogo
// @access  Private
router.delete('/:id', authMiddleware, deleteGame);

// @route   POST /api/games/:id/escalacao/:studentId
// @desc    Adicionar aluno à escalação
// @access  Private
router.post('/:id/escalacao/:studentId', authMiddleware, addStudentToEscalacao);

// @route   DELETE /api/games/:id/escalacao/:studentId
// @desc    Remover aluno da escalação
// @access  Private
router.delete('/:id/escalacao/:studentId', authMiddleware, removeStudentFromEscalacao);

// @route   PUT /api/games/:id/finalizar
// @desc    Finalizar jogo (adicionar resultado)
// @access  Private
router.put('/:id/finalizar', authMiddleware, finalizarJogoValidation, finalizarJogo);

// @route   PUT /api/games/:id/cancelar
// @desc    Cancelar jogo
// @access  Private
router.put('/:id/cancelar', authMiddleware, cancelarJogo);

// @route   GET /api/games/statistics
// @desc    Obter estatísticas dos jogos
// @access  Private
router.get('/statistics', authMiddleware, getGameStatistics);

module.exports = router;