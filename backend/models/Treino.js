const mongoose = require('mongoose');

const treinoSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    trim: true
  },
  diasSemana: {
    type: [String],
    required: [true, 'Dias da semana são obrigatórios'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Deve haver pelo menos um dia da semana selecionado'
    },
    enum: {
      values: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
      message: 'Dia da semana inválido'
    }
  },
  horarioInicio: {
    type: String,
    required: [true, 'Horário de início é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de início deve estar no formato HH:MM']
  },
  horarioFim: {
    type: String,
    required: [true, 'Horário de fim é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de fim deve estar no formato HH:MM']
  },
  local: {
    type: String,
    required: [true, 'Local é obrigatório'],
    trim: true,
    maxlength: [200, 'Local deve ter no máximo 200 caracteres']
  },
  tecnico: {
    type: String,
    required: [true, 'Técnico responsável é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome do técnico deve ter no máximo 100 caracteres']
  },
  observacoes: {
    type: String,
    trim: true,
    maxlength: [500, 'Observações devem ter no máximo 500 caracteres']
  },
  ativo: {
    type: Boolean,
    default: true
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
treinoSchema.index({ categoria: 1 });
treinoSchema.index({ ativo: 1 });
treinoSchema.index({ categoria: 1, ativo: 1 });

// Virtual para formatar dias da semana
treinoSchema.virtual('diasSemanaFormatted').get(function() {
  return this.diasSemana.join(', ');
});

// Virtual para formatar horário completo
treinoSchema.virtual('horarioCompleto').get(function() {
  return `${this.horarioInicio} - ${this.horarioFim}`;
});

// Pre-save middleware para validar categoria
treinoSchema.pre('save', async function(next) {
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

// Pre-save middleware para validar horários
treinoSchema.pre('save', function(next) {
  if (this.isModified('horarioInicio') || this.isModified('horarioFim')) {
    const [horaInicio, minutoInicio] = this.horarioInicio.split(':').map(Number);
    const [horaFim, minutoFim] = this.horarioFim.split(':').map(Number);
    
    const totalMinutosInicio = horaInicio * 60 + minutoInicio;
    const totalMinutosFim = horaFim * 60 + minutoFim;
    
    if (totalMinutosFim <= totalMinutosInicio) {
      return next(new Error('Horário de fim deve ser posterior ao horário de início'));
    }
  }
  next();
});

module.exports = mongoose.model('Treino', treinoSchema);
