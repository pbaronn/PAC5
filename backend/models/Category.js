const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    unique: true,
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [50, 'Nome deve ter no máximo 50 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [200, 'Descrição deve ter no máximo 200 caracteres']
  },
  cor: {
    type: String,
    default: '#3B82F6', // Azul padrão
    match: [/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal (#RRGGBB)']
  },
  ativo: {
    type: Boolean,
    default: true
  },
  // Estatísticas
  totalAlunos: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Middleware para atualizar contador de alunos
categorySchema.methods.updateStudentCount = async function() {
  const Student = mongoose.model('Student');
  const count = await Student.countDocuments({ category: this.nome });
  this.totalAlunos = count;
  await this.save();
};

// Índices para performance
categorySchema.index({ ativo: 1 });

module.exports = mongoose.model('Category', categorySchema);