const express = require('express');
const { login, validateToken, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.post('/login', login);
router.post('/register', register);

// Rotas protegidas
router.get('/validate', authMiddleware, validateToken);

module.exports = router;