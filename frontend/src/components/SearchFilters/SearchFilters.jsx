import React from 'react';
import { Search, X } from 'lucide-react';
import FormField from '../FormField/FormField';
import './SearchFilters.css';

const SearchFilters = ({
  selectedCategory,
  setSelectedCategory,
  studentName,
  setStudentName,
  onClear,
  categories = []
}) => {
  // Mapear categorias da API para o formato esperado pelo FormField
  const categoriesOptions = categories.map(category => ({
    value: category,
    label: category
  }));

  const handleSearch = () => {
    // A busca é automática através dos useEffect, mas pode adicionar lógica aqui se necessário
    console.log('Buscando com filtros:', { selectedCategory, studentName });
  };

  return (
    <div className="search-filters">
      <div className="filter-group">
        <FormField
          type="select"
          label="Categoria:"
          id="categoria"
          name="categoria"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={[{ value: '', label: 'Todas as Categorias' }, ...categoriesOptions]}
        />
      </div>
      
      <div className="filter-group">
        <FormField
          label="Aluno:"
          id="aluno"
          name="aluno"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Digite o nome do aluno"
        />
      </div>
      
      <div className="filter-buttons">
        <button type="button" className="search-btn" onClick={handleSearch}>
          <Search size={16} />
          Buscar
        </button>
        <button type="button" className="clear-btn" onClick={onClear}>
          <X size={16} />
          Limpar
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;