const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '', // Coloque sua senha do MySQL aqui
  database: 'student_management',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = { sequelize };