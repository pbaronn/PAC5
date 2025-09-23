import React from 'react';
import './RadioGroup.css';

const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' }
  ]
}) => {
  return (
    <div className="form-group full-width">
      <label>{label}</label>
      <div className="radio-group">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;