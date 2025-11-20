const Game = require('../models/Game');
const Student = require('../models/Student');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Criar um novo jogo
// @route   POST /api/games
// @access  Private
const createGame = async (req, res) => {
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
      time1,
      time2,
      dataJogo,
      horario,
      local,
      cep,
      cidade,
      uf,
      tipo,
      categoria,
      juiz,
      escalacao = [],
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

    // Criar o jogo
    const game = new Game({
      time1,
      time2,
      dataJogo,
      horario,
      local,
      cep,
      cidade,
      uf: uf.toUpperCase(),
      tipo,
      categoria,
      juiz,
      escalacao,
      observacoes,
      criadoPor: req.user?.id || null
    });

    const savedGame = await game.save();
    await savedGame.populateEscalacao();

    res.status(201).json({
      success: true,
      message: 'Jogo criado com sucesso',
      data: savedGame
    });

  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Listar todos os jogos
// @route   GET /api/games
// @access  Private
const getGames = async (req, res) => {
  try {
    const {
      categoria,
      tipo,
      status,
      futuro,
      finalizado,
      page = 1,
      limit = 10,
      sortBy = 'dataJogo',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters = {};

    if (categoria) {
      filters.categoria = categoria;
    }

    if (tipo) {
      filters.tipo = tipo;
    }

    if (status) {
      filters.status = status;
    }

    // Filtrar por data
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (futuro === 'true') {
      filters.dataJogo = { $gte: hoje };
    }

    if (finalizado === 'true') {
      filters.dataJogo = { $lt: hoje };
    }

    // Calcular paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Buscar jogos
    const games = await Game.find(filters)
      .populate('escalacao.aluno', 'nomeAluno categoria')
      .populate('criadoPor', 'nome email')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Game.countDocuments(filters);

    res.json({
      success: true,
      data: games,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar jogos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter jogo por ID
// @route   GET /api/games/:id
// @access  Private
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('escalacao.aluno', 'nomeAluno categoria dataNascimento genero telefone')
      .populate('criadoPor', 'nome email');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    res.json({
      success: true,
      data: game
    });

  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Atualizar jogo
// @route   PUT /api/games/:id
// @access  Private
const updateGame = async (req, res) => {
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

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    // Atualizar campos
    const updateData = { ...req.body };
    
    if (updateData.uf) {
      updateData.uf = updateData.uf.toUpperCase();
    }

    Object.keys(updateData).forEach(key => {
      game[key] = updateData[key];
    });

    const updatedGame = await game.save();
    await updatedGame.populateEscalacao();

    res.json({
      success: true,
      message: 'Jogo atualizado com sucesso',
      data: updatedGame
    });

  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Deletar jogo
// @route   DELETE /api/games/:id
// @access  Private
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    await Game.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Jogo deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Adicionar aluno à escalação
// @route   POST /api/games/:id/escalacao/:studentId
// @access  Private
const addStudentToEscalacao = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }

    // Verificar se o aluno pertence à categoria do jogo
    const belongsToCategory = student.categories?.includes(game.categoria) || 
                             student.category === game.categoria;

    if (!belongsToCategory) {
      return res.status(400).json({
        success: false,
        message: `Aluno ${student.nomeAluno} não pertence à categoria ${game.categoria}`
      });
    }

    // Verificar se o aluno já está na escalação
    if (game.escalacao.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Aluno já está na escalação'
      });
    }

    game.escalacao.push(studentId);
    await game.save();
    await game.populateEscalacao();

    res.json({
      success: true,
      message: 'Aluno adicionado à escalação',
      data: game
    });

  } catch (error) {
    console.error('Erro ao adicionar aluno à escalação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Remover aluno da escalação
// @route   DELETE /api/games/:id/escalacao/:studentId
// @access  Private
const removeStudentFromEscalacao = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    // Remover o aluno da escalação
    game.escalacao = game.escalacao.filter(
      student => student.toString() !== studentId
    );

    await game.save();
    await game.populateEscalacao();

    res.json({
      success: true,
      message: 'Aluno removido da escalação',
      data: game
    });

  } catch (error) {
    console.error('Erro ao remover aluno da escalação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter alunos disponíveis para escalação por categoria
// @route   GET /api/games/students/:categoria
// @access  Private
const getStudentsByCategory = async (req, res) => {
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

    // Buscar alunos da categoria
    const students = await Student.find({
      $or: [
        { categories: categoria },
        { category: categoria }
      ]
    }).select('nomeAluno categoria categories dataNascimento genero telefone');

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Erro ao buscar alunos por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Finalizar jogo (adicionar resultado)
// @route   PUT /api/games/:id/finalizar
// @access  Private
const finalizarJogo = async (req, res) => {
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

    const { golsTime1, golsTime2, observacoes } = req.body;

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    // Atualizar o jogo
    game.status = 'finalizado';
    game.resultado = {
      golsTime1: parseInt(golsTime1) || 0,
      golsTime2: parseInt(golsTime2) || 0
    };

    if (observacoes) {
      game.observacoes = observacoes;
    }

    await game.save();
    await game.populateEscalacao();

    res.json({
      success: true,
      message: 'Jogo finalizado com sucesso',
      data: game
    });

  } catch (error) {
    console.error('Erro ao finalizar jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// @desc    Obter estatísticas dos jogos
// @route   GET /api/games/statistics
// @access  Private
const getGameStatistics = async (req, res) => {
  try {
    const { categoria, periodo } = req.query;

    // Filtros
    const matchStage = {};
    
    if (categoria) {
      matchStage.categoria = categoria;
    }

    if (periodo) {
      const hoje = new Date();
      switch (periodo) {
        case 'mes':
          matchStage.dataJogo = {
            $gte: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
            $lte: hoje
          };
          break;
        case 'trimestre':
          const inicioTrimestre = new Date(hoje);
          inicioTrimestre.setMonth(hoje.getMonth() - 3);
          matchStage.dataJogo = {
            $gte: inicioTrimestre,
            $lte: hoje
          };
          break;
        case 'ano':
          matchStage.dataJogo = {
            $gte: new Date(hoje.getFullYear(), 0, 1),
            $lte: hoje
          };
          break;
      }
    }

    // Agregação para estatísticas
    const stats = await Game.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalJogos: { $sum: 1 },
          jogosFinalizados: {
            $sum: { $cond: [{ $eq: ['$status', 'finalizado'] }, 1, 0] }
          },
          jogosAgendados: {
            $sum: { $cond: [{ $eq: ['$status', 'agendado'] }, 1, 0] }
          },
          jogosCancelados: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelado'] }, 1, 0] }
          },
          totalGols: {
            $sum: {
              $add: [
                { $ifNull: ['$resultado.golsTime1', 0] },
                { $ifNull: ['$resultado.golsTime2', 0] }
              ]
            }
          },
          mediaGolsPorJogo: {
            $avg: {
              $add: [
                { $ifNull: ['$resultado.golsTime1', 0] },
                { $ifNull: ['$resultado.golsTime2', 0] }
              ]
            }
          }
        }
      }
    ]);

    // Estatísticas por tipo de jogo
    const statsByType = await Game.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Estatísticas por categoria
    const statsByCategory = await Game.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const result = {
      geral: stats[0] || {
        totalJogos: 0,
        jogosFinalizados: 0,
        jogosAgendados: 0,
        jogosCancelados: 0,
        totalGols: 0,
        mediaGolsPorJogo: 0
      },
      porTipo: statsByType,
      porCategoria: statsByCategory
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

// @desc    Cancelar jogo
// @route   PUT /api/games/:id/cancelar
// @access  Private
const cancelarJogo = async (req, res) => {
  try {
    const { motivo } = req.body;

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    if (game.status === 'finalizado') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar um jogo já finalizado'
      });
    }

    game.status = 'cancelado';
    
    if (motivo) {
      game.observacoes = game.observacoes ? 
        `${game.observacoes}\n\nCancelado: ${motivo}` : 
        `Cancelado: ${motivo}`;
    }

    await game.save();
    await game.populateEscalacao();

    res.json({
      success: true,
      message: 'Jogo cancelado com sucesso',
      data: game
    });

  } catch (error) {
    console.error('Erro ao cancelar jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  addStudentToEscalacao,
  removeStudentFromEscalacao,
  getStudentsByCategory,
  finalizarJogo,
  getGameStatistics,
  cancelarJogo
};