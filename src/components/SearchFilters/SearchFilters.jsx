import React from 'react';
import { Search, X } from 'lucide-react';
import FormField from '../FormField/FormField';
import './SearchFilters.css';

const SearchFilters = ({
  selectedCategory,
  setSelectedCategory,
  studentName,
  setStudentName,
  onClear
}) => {
  const categoriesOptions = [
    { value: 'Sub-5', label: 'Sub-5' },
    { value: 'Sub-6', label: 'Sub-6' },
    { value: 'Sub-7', label: 'Sub-7' },
    { value: 'Sub-8', label: 'Sub-8' }
  ];

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
        <button type="button" className="search-btn">
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