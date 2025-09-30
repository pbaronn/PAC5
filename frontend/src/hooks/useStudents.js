import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const loadStudents = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getStudents(filters);
      setStudents(response.students || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar alunos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  }, []);

  const createStudent = async (studentData) => {
    try {
      const response = await apiService.createStudent(studentData);
      await loadStudents(); // Recarrega a lista
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const response = await apiService.updateStudent(id, studentData);
      await loadStudents(); // Recarrega a lista
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      await apiService.deleteStudent(id);
      await loadStudents(); // Recarrega a lista
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getStudentById = async (id) => {
    try {
      const response = await apiService.getStudentById(id);
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    students,
    categories,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    refreshStudents: loadStudents
  };
};