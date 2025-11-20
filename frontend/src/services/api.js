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

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default {
  studentService,
  categoryService,
  authService,
};