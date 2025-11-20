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
  // Array de IDs de alunos vinculados a esta categoria
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
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
  // Contar alunos que têm esta categoria no array categories OU no campo legado category
  const count = await Student.countDocuments({ 
    $or: [
      { categories: this.nome },
      { category: this.nome }
    ]
  });
  this.totalAlunos = count;
  this.students = await Student.find({
    $or: [
      { categories: this.nome },
      { category: this.nome }
    ]
  }).distinct('_id');
  await this.save();
};

// Índices para performance
categorySchema.index({ ativo: 1 });

module.exports = mongoose.model('Category', categorySchema);