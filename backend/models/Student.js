const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomeAluno: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome do aluno é obrigatório' },
      len: { args: [2, 100], msg: 'Nome deve ter entre 2 e 100 caracteres' }
    }
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'feminino', 'outro'),
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'CPF já cadastrado'
    }
    // REMOVIDO: validate com validação de CPF
  },
  rg: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomeResponsavel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpfResponsavel: {
    type: DataTypes.STRING,
    allowNull: false
    // REMOVIDO: validate com validação de CPF
  },
  telefoneResponsavel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grauParentesco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Sub-6'
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    defaultValue: 'Ativo'
  }
}, {
  tableName: 'students',
  timestamps: true
});

module.exports = Student;