const mongoose = require('mongoose');

const contatoEmergenciaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do contato é obrigatório'],
    trim: true
  },
  telefone: {
    type: String,
    required: [true, 'Telefone do contato é obrigatório'],
    trim: true
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  nomeAluno: {
    type: String,
    required: [true, 'Nome do aluno é obrigatório'],
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    trim: true
  },
  dataNascimento: {
    type: Date,
    required: [true, 'Data de nascimento é obrigatória']
  },
  genero: {
    type: String,
    required: [true, 'Gênero é obrigatório'],
    enum: {
      values: ['masculino', 'feminino', 'outro'],
      message: 'Gênero deve ser masculino, feminino ou outro'
    }
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true
  },
  telefone2: {
    type: String,
    trim: true
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    trim: true
  },
  rg: {
    type: String,
    required: [true, 'RG é obrigatório'],
    trim: true
  },
  rua: {
    type: String,
    required: [true, 'Rua é obrigatória'],
    trim: true
  },
  bairro: {
    type: String,
    required: [true, 'Bairro é obrigatório'],
    trim: true
  },
  cidade: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true
  },
  cep: {
    type: String,
    required: [true, 'CEP é obrigatório'],
    trim: true
  },
  observacoes: {
    type: String,
    trim: true
  },
  nomeResponsavel: {
    type: String,
    required: [true, 'Nome do responsável é obrigatório'],
    trim: true
  },
  cpfResponsavel: {
    type: String,
    required: [true, 'CPF do responsável é obrigatório'],
    trim: true
  },
  telefoneResponsavel: {
    type: String,
    required: [true, 'Telefone do responsável é obrigatório'],
    trim: true
  },
  grauParentesco: {
    type: String,
    required: [true, 'Grau de parentesco é obrigatório'],
    trim: true
  },
  autorizaJogosForaCidade: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  contatosEmergencia: [contatoEmergenciaSchema],
  // Campos de anamnese
  possuiAlergias: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  detalhesAlergias: {
    type: String,
    trim: true
  },
  possuiDoenca: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  detalhesDoenca: {
    type: String,
    trim: true
  },
  estaTratandoDoenca: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  teveLesaoOrtopedica: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  detalhesLesao: {
    type: String,
    trim: true
  },
  passouPorCirurgia: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  detalhesCirurgia: {
    type: String,
    trim: true
  },
  usaMedicamentoContinuo: {
    type: String,
    enum: ['sim', 'nao', ''],
    trim: true
  },
  detalhesMedicamento: {
    type: String,
    trim: true
  },
  tipoSanguineo: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    trim: true
  },
  category: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['Ativo', 'Inativo'],
      message: 'Status deve ser Ativo ou Inativo'
    },
    default: 'Ativo'
  }
}, {
  timestamps: true,
  collection: 'students'
});

// Middleware para garantir que CPF seja único
studentSchema.pre('save', async function(next) {
  if (this.isModified('cpf')) {
    const existingStudent = await this.constructor.findOne({ 
      cpf: this.cpf, 
      _id: { $ne: this._id } 
    });
    if (existingStudent) {
      const error = new Error('CPF já cadastrado');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;