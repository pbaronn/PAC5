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

// @desc    Atualizar perfil do usuário
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, username } = req.body;
    const userId = req.user.id;

    // Buscar usuário
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o novo username já existe (se estiver mudando)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Nome de usuário já está em uso'
        });
      }
      user.username = username;
    }

    // Verificar se o novo email já existe (se estiver mudando)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
      user.email = email;
    }

    // Atualizar nome se fornecido
    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Alterar senha do usuário
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validações
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nova senha deve ter no mínimo 6 caracteres'
      });
    }

    // Buscar usuário
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Validar senha atual
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    user.password = newPassword; // Será hasheado automaticamente pelo middleware
    await user.save();

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter dados do usuário logado
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        active: user.active
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  login,
  validateToken,
  register,
  updateProfile,
  changePassword,
  getMe
};