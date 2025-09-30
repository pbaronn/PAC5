const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log('🔍 API Request:', url, config); // DEBUG

    try {
      const response = await fetch(url, config);
      
      console.log('📡 API Response Status:', response.status); // DEBUG
      
      const data = await response.json();
      console.log('📦 API Response Data:', data); // DEBUG

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Se o token expirou, fazer logout
      if (error.message.includes('Token') || error.message.includes('401')) {
        this.setToken(null);
        window.location.reload();
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async login(username, password) {
    console.log('🔐 Tentando login...', { username }); // DEBUG
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async validateToken() {
    return this.request('/auth/validate');
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }

  // Students endpoints
  async getStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getStudentById(id) {
    return this.request(`/students/${id}`);
  }

  async createStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id, studentData) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories() {
    return this.request('/students/categories');
  }
}

export default new ApiService();