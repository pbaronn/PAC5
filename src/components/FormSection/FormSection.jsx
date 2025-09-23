import React from 'react';
import { ChevronDown } from 'lucide-react';
import './FormSection.css';

const FormSection = ({ 
  title, 
  isExpanded, 
  onToggle, 
  children, 
  sectionName 
}) => {
  return (
    <div>
      <div 
        className="form-section-header" 
        onClick={onToggle}
        data-section={sectionName}
      >
        <span>{title}</span>
        <ChevronDown 
          size={24} 
          className={`chevron ${isExpanded ? 'expanded' : ''}`} 
        />
      </div>
      {isExpanded && (
        <div className="form-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;
