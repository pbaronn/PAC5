const Category = require('../models/Category');
const Student = require('../models/Student');

// Criar categoria
const createCategory = async (req, res) => {
  try {
    const { nome, descricao, cor, idadeMinima, idadeMaxima } = req.body;

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
      cor: cor || '#3B82F6',
      idadeMinima: idadeMinima || undefined,
      idadeMaxima: idadeMaxima || undefined
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

    res.json({ 
      success: true,
      data: categories 
    });
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
    
    console.log('getCategoryById - Buscando categoria com ID:', id);
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }
    
    console.log('getCategoryById - Categoria encontrada:', category);
    console.log('getCategoryById - Campo ativo:', category.ativo);

    // Atualizar contagem de alunos
    await category.updateStudentCount();
    
    console.log('getCategoryById - Após updateStudentCount:', category);
    console.log('getCategoryById - Campo ativo após update:', category.ativo);

    res.json({ 
      success: true,
      data: category 
    });
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
    const { nome, descricao, cor, ativo, idadeMinima, idadeMaxima } = req.body;
    
    console.log('updateCategory - ID:', id);
    console.log('updateCategory - Body recebido:', req.body);
    console.log('updateCategory - Campo ativo:', ativo);
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }
    
    console.log('updateCategory - Categoria atual:', category);

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

    // Preparar dados para atualização - só incluir campos que foram enviados
    const updateData = {};
    
    if (nome !== undefined) updateData.nome = nome;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (cor !== undefined) updateData.cor = cor;
    if (ativo !== undefined) updateData.ativo = ativo;
    if (idadeMinima !== undefined) updateData.idadeMinima = idadeMinima;
    if (idadeMaxima !== undefined) updateData.idadeMaxima = idadeMaxima;
    
    console.log('updateCategory - Dados para update:', updateData);

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('updateCategory - Categoria atualizada:', updatedCategory);

    // Atualizar contagem de alunos
    await updatedCategory.updateStudentCount();

    res.json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory
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
      success: true,
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
      success: true,
      message: `Categoria ${category.ativo ? 'ativada' : 'desativada'} com sucesso`,
      data: category
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

    const students = await Student.find({ 
      $or: [
        { categories: category.nome },
        { category: category.nome }
      ]
    })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ nomeAluno: 1 });

    res.json({
      success: true,
      students: students, // Mudei de 'data' para 'students' para consistência
      category: category.nome,
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

// Vincular alunos a uma categoria
const addStudentsToCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body; // Array de IDs de alunos

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: 'studentIds deve ser um array não vazio'
      });
    }

    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    // Atualizar cada aluno para adicionar a categoria
    const updatePromises = studentIds.map(async (studentId) => {
      const student = await Student.findById(studentId);
      if (student) {
        // Adicionar ao novo array categories
        if (!student.categories) {
          student.categories = [];
        }
        if (!student.categories.includes(category.nome)) {
          student.categories.push(category.nome);
        }
        // Manter category para compatibilidade (usar a primeira categoria)
        if (!student.category) {
          student.category = category.nome;
        }
        await student.save();
      }
    });

    await Promise.all(updatePromises);

    // Atualizar contagem
    await category.updateStudentCount();

    res.json({
      success: true,
      message: 'Alunos vinculados com sucesso',
      data: category
    });
  } catch (error) {
    console.error('Erro ao vincular alunos:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Desvincular aluno de uma categoria
const removeStudentFromCategory = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada'
      });
    }

    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({
        message: 'Aluno não encontrado'
      });
    }

    // Remover do array categories
    if (student.categories) {
      student.categories = student.categories.filter(cat => cat !== category.nome);
    }

    // Se era a categoria principal, limpar ou usar a próxima
    if (student.category === category.nome) {
      student.category = student.categories && student.categories.length > 0 
        ? student.categories[0] 
        : null;
    }

    await student.save();

    // Atualizar contagem
    await category.updateStudentCount();

    res.json({
      success: true,
      message: 'Aluno desvinculado com sucesso',
      data: category
    });
  } catch (error) {
    console.error('Erro ao desvincular aluno:', error);
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
  getCategoryStudents,
  addStudentsToCategory,
  removeStudentFromCategory
};