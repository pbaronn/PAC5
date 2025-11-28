// Configuração base da API
const API_BASE_URL = 'http://localhost:3001/api';

// Função helper para fazer requisições
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// Serviços para alunos
export const studentService = {
  // Criar novo aluno
  create: async (studentData) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  // Buscar todos os alunos
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.name) queryParams.append('name', filters.name);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const url = `/students${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiRequest(url);
  },

  // Buscar aluno por ID
  getById: async (id) => {
    return apiRequest(`/students/${id}`);
  },

  // Atualizar aluno
  update: async (id, studentData) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  // Deletar aluno
  delete: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar categorias
  getCategories: async () => {
    return apiRequest('/students/categories');
  },
};

// Serviços para categorias
export const categoryService = {
  // Criar categoria
  create: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Listar categorias
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.ativo !== undefined) queryParams.append('ativo', filters.ativo);
    if (filters.includeStudentCount) queryParams.append('includeStudentCount', 'true');

    const url = `/categories${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiRequest(url);
  },

  // Buscar categoria por ID
  getById: async (id) => {
    return apiRequest(`/categories/${id}`);
  },

  // Atualizar categoria
  update: async (id, categoryData) => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Deletar categoria
  delete: async (id) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Ativar/Desativar categoria
  toggleStatus: async (id) => {
    return apiRequest(`/categories/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Listar alunos da categoria
  getStudents: async (id, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const url = `/categories/${id}/students${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiRequest(url);
  },

  // Vincular alunos à categoria
  addStudentsToCategory: async (id, studentIds) => {
    return apiRequest(`/categories/${id}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentIds }),
    });
  },

  // Desvincular aluno da categoria
  removeStudentFromCategory: async (id, studentId) => {
    return apiRequest(`/categories/${id}/students/${studentId}`, {
      method: 'DELETE',
    });
  },
};

// Serviços para autenticação
export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Registro
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Validar token
  validateToken: async () => {
    return apiRequest('/auth/validate');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se está logado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual (do localStorage)
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obter dados atualizados do usuário do servidor
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  // Atualizar perfil do usuário (nome, username, email)
  updateProfile: async (profileData) => {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    // Atualizar localStorage com os novos dados
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Alterar senha
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Serviços para jogos
export const gameService = {
  // Criar novo jogo
  create: async (gameData) => {
    return apiRequest('/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  },

  // Buscar todos os jogos
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/games?${queryString}` : '/games';
    
    return apiRequest(url);
  },

  // Buscar jogo por ID
  getById: async (id) => {
    return apiRequest(`/games/${id}`);
  },

  // Atualizar jogo
  update: async (id, gameData) => {
    return apiRequest(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  },

  // Deletar jogo
  delete: async (id) => {
    return apiRequest(`/games/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar alunos por categoria para escalação
  getStudentsByCategory: async (categoria) => {
    return apiRequest(`/games/students/${encodeURIComponent(categoria)}`);
  },

  // Adicionar aluno à escalação
  addStudentToEscalacao: async (gameId, studentId) => {
    return apiRequest(`/games/${gameId}/escalacao/${studentId}`, {
      method: 'POST',
    });
  },

  // Remover aluno da escalação
  removeStudentFromEscalacao: async (gameId, studentId) => {
    return apiRequest(`/games/${gameId}/escalacao/${studentId}`, {
      method: 'DELETE',
    });
  },

  // Finalizar jogo
  finalizar: async (gameId, resultado) => {
    return apiRequest(`/games/${gameId}/finalizar`, {
      method: 'PUT',
      body: JSON.stringify(resultado),
    });
  },

  // Buscar próximos jogos (apenas agendados, não finalizados)
  getUpcomingGames: async () => {
    return apiRequest('/games?futuro=true&status=agendado&sortBy=dataJogo&sortOrder=asc');
  },

  // Buscar jogos finalizados (por status, não por data)
  getFinishedGames: async () => {
    return apiRequest('/games?status=finalizado&sortBy=dataJogo&sortOrder=desc');
  },

  // Finalizar jogo
  finalizarJogo: async (id, resultadoData) => {
    return apiRequest(`/games/${id}/finalizar`, {
      method: 'PUT',
      body: JSON.stringify(resultadoData),
    });
  },
};

// Serviços para treinos
export const treinoService = {
  // Criar novo treino
  create: async (treinoData) => {
    return apiRequest('/treinos', {
      method: 'POST',
      body: JSON.stringify(treinoData),
    });
  },

  // Buscar todos os treinos
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/treinos?${queryString}` : '/treinos';
    
    return apiRequest(url);
  },

  // Buscar treino por ID
  getById: async (id) => {
    return apiRequest(`/treinos/${id}`);
  },

  // Atualizar treino
  update: async (id, treinoData) => {
    return apiRequest(`/treinos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(treinoData),
    });
  },

  // Deletar treino
  delete: async (id) => {
    return apiRequest(`/treinos/${id}`, {
      method: 'DELETE',
    });
  },

  // Ativar/Desativar treino
  toggleStatus: async (id) => {
    return apiRequest(`/treinos/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Buscar treinos por categoria
  getByCategoria: async (categoria) => {
    return apiRequest(`/treinos/categoria/${encodeURIComponent(categoria)}`);
  },

  // Buscar alunos do treino (da categoria)
  getAlunos: async (id) => {
    return apiRequest(`/treinos/${id}/alunos`);
  },

  // Obter estatísticas
  getStatistics: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.categoria) queryParams.append('categoria', filters.categoria);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/treinos/statistics?${queryString}` : '/treinos/statistics';
    
    return apiRequest(url);
  },
};

export default {
  studentService,
  categoryService,
  authService,
  gameService,
  treinoService,
};