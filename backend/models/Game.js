const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  time1: {
    type: String,
    required: [true, 'Time 1 é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome do time deve ter no máximo 100 caracteres']
  },
  time2: {
    type: String,
    required: [true, 'Time 2 é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome do time deve ter no máximo 100 caracteres']
  },
  dataJogo: {
    type: Date,
    required: [true, 'Data do jogo é obrigatória']
  },
  horario: {
    type: String,
    required: [true, 'Horário é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM']
  },
  local: {
    type: String,
    required: [true, 'Local é obrigatório'],
    trim: true,
    maxlength: [200, 'Local deve ter no máximo 200 caracteres']
  },
  cep: {
    type: String,
    required: [true, 'CEP é obrigatório'],
    trim: true,
    match: [/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000']
  },
  cidade: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true,
    maxlength: [100, 'Cidade deve ter no máximo 100 caracteres']
  },
  uf: {
    type: String,
    required: [true, 'UF é obrigatória'],
    trim: true,
    uppercase: true,
    minlength: [2, 'UF deve ter 2 caracteres'],
    maxlength: [2, 'UF deve ter 2 caracteres']
  },
  tipo: {
    type: String,
    required: [true, 'Tipo do jogo é obrigatório'],
    enum: {
      values: ['amistoso', 'campeonato', 'torneio', 'copa', 'festival', 'treino'],
      message: 'Tipo deve ser: amistoso, campeonato, torneio, copa, festival ou treino'
    }
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    trim: true
  },
  juiz: {
    type: String,
    required: [true, 'Juiz é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome do juiz deve ter no máximo 100 caracteres']
  },
  // Escalação - array de objetos com aluno e posição
  escalacao: [{
    aluno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    posicao: {
      type: String,
      enum: ['goleiro', 'zagueiro', 'lateral-direito', 'lateral-esquerdo', 'volante', 'meia', 'meia-atacante', 'ponta-direita', 'ponta-esquerda', 'atacante', 'centroavante', ''],
      default: ''
    }
  }],
  // Status do jogo
  status: {
    type: String,
    enum: ['agendado', 'em_andamento', 'finalizado', 'cancelado'],
    default: 'agendado'
  },
  // Resultado (apenas para jogos finalizados)
  resultado: {
    golsTime1: {
      type: Number,
      min: 0,
      default: null
    },
    golsTime2: {
      type: Number,
      min: 0,
      default: null
    }
  },
  // Observações
  observacoes: {
    type: String,
    trim: true,
    maxlength: [500, 'Observações devem ter no máximo 500 caracteres']
  },
  // Campos de auditoria
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Índices para performance
gameSchema.index({ dataJogo: 1 });
gameSchema.index({ categoria: 1 });
gameSchema.index({ status: 1 });
gameSchema.index({ dataJogo: 1, categoria: 1 });

// Virtual para verificar se o jogo já passou
gameSchema.virtual('isFinished').get(function() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataJogo = new Date(this.dataJogo);
  dataJogo.setHours(0, 0, 0, 0);
  
  return dataJogo < hoje;
});

// Virtual para verificar se é um jogo futuro
gameSchema.virtual('isFuture').get(function() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataJogo = new Date(this.dataJogo);
  dataJogo.setHours(0, 0, 0, 0);
  
  return dataJogo >= hoje;
});

// Método para popular escalação
gameSchema.methods.populateEscalacao = async function() {
  await this.populate('escalacao.aluno', 'nomeAluno categoria dataNascimento genero');
  return this;
};

// Pre-save middleware para validar categoria
gameSchema.pre('save', async function(next) {
  if (this.isModified('categoria')) {
    const Category = mongoose.model('Category');
    const categoryExists = await Category.findOne({ 
      nome: this.categoria, 
      ativo: true 
    });
    
    if (!categoryExists) {
      return next(new Error('Categoria não encontrada ou inativa'));
    }
  }
  next();
});

// Pre-save middleware para validar escalação
gameSchema.pre('save', async function(next) {
  if (this.isModified('escalacao') && this.escalacao.length > 0) {
    const Student = mongoose.model('Student');
    
    // Verificar se todos os alunos existem e pertencem à categoria
    for (const escalacaoItem of this.escalacao) {
      // Obter o ID do aluno (suporta ambos os formatos)
      const studentId = escalacaoItem.aluno || escalacaoItem;
      
      const student = await Student.findById(studentId);
      if (!student) {
        return next(new Error('Aluno não encontrado na escalação'));
      }
      
      // Verificar se o aluno pertence à categoria do jogo
      const belongsToCategory = student.categories?.includes(this.categoria) || 
                               student.category === this.categoria;
      
      if (!belongsToCategory) {
        return next(new Error(`Aluno ${student.nomeAluno} não pertence à categoria ${this.categoria}`));
      }
    }
  }
  next();
});

module.exports = mongoose.model('Game', gameSchema);