const Category = require('../models/Category');
const Student = require('../models/Student');

// Criar categoria
const createCategory = async (req, res) => {
  try {
    const { nome, descricao, cor } = req.body;

    // Verificar se categoria já existe
    const existingCategory = await Category.findOne({ 
      nome: { $regex: new RegExp(`^${nome}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({
        message: 'Categoria com este nome já existe'
      });
    }

    const category = new Category({
      nome,
      descricao,
      cor: cor || '#3B82F6'
    });

    await category.save();

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      category
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    
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

// Listar categorias
const getCategories = async (req, res) => {
  try {
    const { ativo, includeStudentCount } = req.query;
    
    const query = {};
    if (ativo !== undefined) {
      query.ativo = ativo === 'true';
    }

    let categories = await Category.find(query).sort({ nome: 1 });

    // Atualizar contagem de alunos se solicitado
    if (includeStudentCount === 'true') {
      for (let category of categories) {
        await category.updateStudentCount();
      }
      // Buscar novamente para pegar os dados atualizados
      categories = await Category.find(query).sort({ nome: 1 });
    }

    res.json({ categories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar categoria por ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    // Atualizar contagem de alunos
    await category.updateStudentCount();

    res.json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Atualizar categoria
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, cor, ativo } = req.body;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    // Se o nome está mudando, verificar duplicidade
    if (nome && nome !== category.nome) {
      const existingCategory = await Category.findOne({
        nome: { $regex: new RegExp(`^${nome}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingCategory) {
        return res.status(400).json({
          message: 'Categoria com este nome já existe'
        });
      }

      // Se está mudando o nome da categoria, atualizar alunos
      await Student.updateMany(
        { category: category.nome },
        { category: nome }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { nome, descricao, cor, ativo },
      { new: true, runValidators: true }
    );

    // Atualizar contagem de alunos
    await updatedCategory.updateStudentCount();

    res.json({
      message: 'Categoria atualizada com sucesso',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    
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

// Deletar categoria
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    // Verificar se há alunos na categoria
    const studentsCount = await Student.countDocuments({ category: category.nome });
    
    if (studentsCount > 0) {
      return res.status(400).json({
        message: `Não é possível excluir a categoria. Existem ${studentsCount} aluno(s) vinculado(s) a ela.`,
        studentsCount
      });
    }

    await Category.findByIdAndDelete(id);
    
    res.json({
      message: 'Categoria excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Ativar/Desativar categoria
const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    category.ativo = !category.ativo;
    await category.save();

    res.json({
      message: `Categoria ${category.ativo ? 'ativada' : 'desativada'} com sucesso`,
      category
    });
  } catch (error) {
    console.error('Erro ao alterar status da categoria:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Listar alunos de uma categoria
const getCategoryStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    const students = await Student.find({ category: category.nome })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ nomeAluno: 1 });

    res.json({
      category: category.nome,
      students,
      total: students.length
    });
  } catch (error) {
    console.error('Erro ao buscar alunos da categoria:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryStudents
};