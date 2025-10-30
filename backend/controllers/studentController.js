const Student = require('../models/Student');
const Category = require('../models/Category');

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
      cpf: studentData.cpf
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'CPF já cadastrado'
      });
    }

    const student = await Student.create(studentData);
    
    console.log('Aluno criado com sucesso:', student._id);
    
    res.status(201).json({
      message: 'Aluno criado com sucesso',
      student
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
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
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (name) {
      query.nomeAluno = { $regex: name, $options: 'i' };
    }
    
    const students = await Student.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ nomeAluno: 1 });
    
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
    
    const student = await Student.findById(id);
    
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
    
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({
        message: 'Aluno não encontrado'
      });
    }

    // Verificar duplicidade de CPF apenas se mudou
    if (studentData.cpf && studentData.cpf !== student.cpf) {
      const existingStudent = await Student.findOne({
        cpf: studentData.cpf,
        _id: { $ne: id }
      });

      if (existingStudent) {
        return res.status(400).json({
          message: 'CPF já cadastrado'
        });
      }
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(id, studentData, { 
      new: true, 
      runValidators: true 
    });
    
    res.json({
      message: 'Aluno atualizado com sucesso',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: Object.values(error.errors).map(err => err.message)
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
    
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({
        message: 'Aluno não encontrado'
      });
    }
    
    await Student.findByIdAndDelete(id);
    
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
    // Buscar categorias ativas do modelo Category
    const categories = await Category.find({ ativo: true }).sort({ nome: 1 });
    
    // Retornar apenas os nomes para compatibilidade com frontend existente
    const categoryNames = categories.map(cat => cat.nome);
    
    res.json({ categories: categoryNames });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

const removeCategoryFromAllStudents = async (req, res) => {
  try {
    // Remover o campo category de todos os alunos
    const result = await Student.updateMany(
      {},
      { $unset: { category: "" } }
    );
    
    console.log(`Categoria removida de ${result.modifiedCount} alunos`);
    
    res.json({
      message: `Categoria removida de ${result.modifiedCount} alunos`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Erro ao remover categoria dos alunos:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getCategories,
  removeCategoryFromAllStudents
};