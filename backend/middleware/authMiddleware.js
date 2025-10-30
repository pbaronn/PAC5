const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_aqui';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Token de acesso não fornecido' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ 
        message: 'Token inválido ou usuário inativo' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Token inválido',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;