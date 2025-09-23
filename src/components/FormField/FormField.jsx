import React from 'react';
import './FormField.css';

const FormField = ({
  type = 'text',
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  fullWidth = false,
  rows = 3
}) => {
  const fieldClass = `form-group ${fullWidth ? 'full-width' : ''}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          >
            <option value="">Selecione</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
          />
        );
      
      default:
        return (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
        );
    }
  };

  return (
    <div className={fieldClass}>
      <label htmlFor={id}>{label}</label>
      {renderInput()}
    </div>
  );
};

export default FormField;