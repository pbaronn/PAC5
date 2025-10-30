const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username é obrigatório'],
    unique: true,
    minlength: [3, 'Username deve ter pelo menos 3 caracteres'],
    maxlength: [50, 'Username deve ter no máximo 50 caracteres'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password é obrigatório'],
    minlength: [3, 'Password deve ter pelo menos 3 caracteres'],
    maxlength: [255, 'Password deve ter no máximo 255 caracteres']
  },
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    trim: true
  },
  email: {
    type: String,
    maxlength: [100, 'Email deve ter no máximo 100 caracteres'],
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Email deve ter um formato válido'
    },
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para validar senha
userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Middleware para garantir que username seja único
userSchema.pre('save', async function(next) {
  if (this.isModified('username')) {
    const existingUser = await this.constructor.findOne({ 
      username: this.username, 
      _id: { $ne: this._id } 
    });
    if (existingUser) {
      const error = new Error('Username já existe');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;