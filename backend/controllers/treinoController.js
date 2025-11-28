const Treino = require('../models/Treino');
const Category = require('../models/Category');
const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// @desc    Criar um novo treino
// @route   POST /api/treinos
// @access  Private
const createTreino = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const {
      categoria,
      diasSemana,
      horarioInicio,
      horarioFim,
      local,
      tecnico,
      observacoes
    } = req.body;

    // Verificar se a categoria existe
    const categoryExists = await Category.findOne({ 
      nome: categoria, 
      ativo: true 
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Categoria não encontrada ou inativa'
      });
    }

    // Criar o treino
    const treino = new Treino({
      categoria,
      diasSemana,
      horarioInicio,
      horarioFim,
      local,
      tecnico,
      observacoes,
      criadoPor: req.user?.id || null
    });

    const savedTreino = await treino.save();

    res.status(201).json({
      success: true,
      message: 'Treino criado com sucesso',
      data: savedTreino
    });

  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Listar todos os treinos
// @route   GET /api/treinos
// @access  Private
const getTreinos = async (req, res) => {
  try {
    const {
      categoria,
      ativo,
      tecnico,
      diaSemana,
      page = 1,
      limit = 100,
      sortBy = 'categoria',
      sortOrder = 'asc'
    } = req.query;

    // Construir filtros
    const filters = {};

    if (categoria) {
      filters.categoria = categoria;
    }

    if (ativo !== undefined) {
      filters.ativo = ativo === 'true';
    }

    if (tecnico) {
      filters.tecnico = new RegExp(tecnico, 'i');
    }

    if (diaSemana) {
      filters.diasSemana = diaSemana;
    }

    // Calcular paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Buscar treinos
    const treinos = await Treino.find(filters)
      .populate('criadoPor', 'nome email')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Treino.countDocuments(filters);

    res.json({
      success: true,
      data: treinos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar treinos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter treino por ID
// @route   GET /api/treinos/:id
// @access  Private
const getTreinoById = async (req, res) => {
  try {
    const treino = await Treino.findById(req.params.id)
      .populate('criadoPor', 'nome email');

    if (!treino) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    res.json({
      success: true,
      data: treino
    });

  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Atualizar treino
// @route   PUT /api/treinos/:id
// @access  Private
const updateTreino = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const treino = await Treino.findById(req.params.id);

    if (!treino) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    // Atualizar campos
    const updateData = { ...req.body };
    
    Object.keys(updateData).forEach(key => {
      treino[key] = updateData[key];
    });

    const updatedTreino = await treino.save();

    res.json({
      success: true,
      message: 'Treino atualizado com sucesso',
      data: updatedTreino
    });

  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Deletar treino
// @route   DELETE /api/treinos/:id
// @access  Private
const deleteTreino = async (req, res) => {
  try {
    const treino = await Treino.findById(req.params.id);

    if (!treino) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    await Treino.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Treino deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Desativar/Ativar treino
// @route   PATCH /api/treinos/:id/toggle
// @access  Private
const toggleTreinoStatus = async (req, res) => {
  try {
    const treino = await Treino.findById(req.params.id);

    if (!treino) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    treino.ativo = !treino.ativo;
    await treino.save();

    res.json({
      success: true,
      message: `Treino ${treino.ativo ? 'ativado' : 'desativado'} com sucesso`,
      data: treino
    });

  } catch (error) {
    console.error('Erro ao alterar status do treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter alunos da categoria do treino
// @route   GET /api/treinos/:id/alunos
// @access  Private
const getAlunosByTreino = async (req, res) => {
  try {
    const treino = await Treino.findById(req.params.id);

    if (!treino) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    // Buscar alunos da categoria do treino
    const alunos = await Student.find({
      $or: [
        { categories: treino.categoria },
        { category: treino.categoria }
      ],
      status: 'Ativo'
    }).select('nomeAluno categoria categories dataNascimento genero telefone');

    res.json({
      success: true,
      data: alunos
    });

  } catch (error) {
    console.error('Erro ao buscar alunos do treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter treinos por categoria
// @route   GET /api/treinos/categoria/:categoria
// @access  Private
const getTreinosByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;

    // Verificar se a categoria existe
    const categoryExists = await Category.findOne({ 
      nome: categoria, 
      ativo: true 
    });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada ou inativa'
      });
    }

    // Buscar treinos da categoria
    const treinos = await Treino.find({ 
      categoria,
      ativo: true 
    }).sort({ horarioInicio: 1 });

    res.json({
      success: true,
      data: treinos
    });

  } catch (error) {
    console.error('Erro ao buscar treinos por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter estatísticas dos treinos
// @route   GET /api/treinos/statistics
// @access  Private
const getTreinoStatistics = async (req, res) => {
  try {
    const { categoria } = req.query;

    // Filtros
    const matchStage = { ativo: true };
    
    if (categoria) {
      matchStage.categoria = categoria;
    }

    // Agregação para estatísticas
    const stats = await Treino.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTreinos: { $sum: 1 },
          totalAtivos: {
            $sum: { $cond: ['$ativo', 1, 0] }
          },
          totalInativos: {
            $sum: { $cond: ['$ativo', 0, 1] }
          }
        }
      }
    ]);

    // Estatísticas por categoria
    const statsByCategory = await Treino.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          tecnicos: { $addToSet: '$tecnico' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Estatísticas por dia da semana
    const statsByDiaSemana = await Treino.aggregate([
      { $match: matchStage },
      { $unwind: '$diasSemana' },
      {
        $group: {
          _id: '$diasSemana',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Estatísticas por técnico
    const statsByTecnico = await Treino.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$tecnico',
          count: { $sum: 1 },
          categorias: { $addToSet: '$categoria' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const result = {
      geral: stats[0] || {
        totalTreinos: 0,
        totalAtivos: 0,
        totalInativos: 0
      },
      porCategoria: statsByCategory,
      porDiaSemana: statsByDiaSemana,
      porTecnico: statsByTecnico
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  createTreino,
  getTreinos,
  getTreinoById,
  updateTreino,
  deleteTreino,
  toggleTreinoStatus,
  getAlunosByTreino,
  getTreinosByCategoria,
  getTreinoStatistics
};
