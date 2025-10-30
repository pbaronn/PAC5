const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_aqui';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Usuário e senha são obrigatórios'
      });
    }

    const user = await User.findOne({ 
      username: username, 
      active: true 
    });

    if (!user) {
      return res.status(401).json({
        message: 'Credenciais inválidas'
      });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciais inválidas'
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const validateToken = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: 'Token inválido'
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    console.log('Tentativa de registro:', { username, name, email });

    if (!username || !password || !name) {
      return res.status(400).json({
        message: 'Usuário, senha e nome são obrigatórios'
      });
    }

    if (password.length < 3) {
      return res.status(400).json({
        message: 'Senha deve ter pelo menos 3 caracteres'
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({
        message: 'Nome de usuário já existe'
      });
    }

    // Verificar se email já existe (se fornecido)
    if (email) {
      const existingEmail = await User.findOne({ email: email });
      if (existingEmail) {
        return res.status(400).json({
          message: 'Email já cadastrado'
        });
      }
    }

    // Criar usuário
    const user = await User.create({
      username,
      password, // Será hasheado automaticamente pelo middleware
      name,
      email: email || null,
      active: true
    });

    console.log('Usuário criado:', user._id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  login,
  validateToken,
  register
};