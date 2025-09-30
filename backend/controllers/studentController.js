const Student = require('../models/Student');
const { Op } = require('sequelize');

const createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    
    console.log('Dados recebidos para criar aluno:', studentData);

    // Validações básicas
    if (!studentData.nomeAluno || !studentData.dataNascimento || !studentData.cpf) {
      return res.status(400).json({
        message: 'Nome, data de nascimento e CPF são obrigatórios'
      });
    }

    // Verificar se CPF já existe
    const existingStudent = await Student.findOne({
      where: { cpf: studentData.cpf }
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'CPF já cadastrado'
      });
    }

    const student = await Student.create(studentData);
    
    console.log('Aluno criado com sucesso:', student.id);
    
    res.status(201).json({
      message: 'Aluno criado com sucesso',
      student
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: error.errors.map(err => err.message)
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'CPF já cadastrado'
      });
    }
    
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const { category, name, limit = 50, offset = 0 } = req.query;
    
    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (name) {
      whereClause.nomeAluno = {
        [Op.iLike]: `%${name}%`
      };
    }
    
    const students = await Student.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nomeAluno', 'ASC']]
    });
    
    res.json({ students });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        message: 'Aluno não encontrado'
      });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = req.body;
    
    console.log('Atualizando aluno:', id, studentData);
    
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        message: 'Aluno não encontrado'
      });
    }

    // Verificar duplicidade de CPF apenas se mudou
    if (studentData.cpf && studentData.cpf !== student.cpf) {
      const existingStudent = await Student.findOne({
        where: { 
          cpf: studentData.cpf,
          id: { [Op.ne]: id }
        }
      });

      if (existingStudent) {
        return res.status(400).json({
          message: 'CPF já cadastrado'
        });
      }
    }
    
    await student.update(studentData);
    
    res.json({
      message: 'Aluno atualizado com sucesso',
      student
    });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        message: 'Aluno não encontrado'
      });
    }
    
    await student.destroy();
    
    res.json({
      message: 'Aluno excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Student.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });
    
    const categoryList = categories.map(c => c.category);
    
    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// ← VERIFICAR SE ESTA EXPORTAÇÃO ESTÁ CORRETA
module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getCategories
};