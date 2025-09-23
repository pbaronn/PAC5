import { useState } from 'react';

export const useFormSections = () => {
  const [isAlunoExpanded, setIsAlunoExpanded] = useState(true);
  const [isResponsavelExpanded, setIsResponsavelExpanded] = useState(false);
  const [isAnamneseExpanded, setIsAnamneseExpanded] = useState(false);

  const handleSectionToggle = (sectionName) => {
    switch (sectionName) {
      case 'aluno':
        setIsAlunoExpanded(!isAlunoExpanded);
        break;
      case 'responsavel':
        setIsResponsavelExpanded(!isResponsavelExpanded);
        break;
      case 'anamnese':
        setIsAnamneseExpanded(!isAnamneseExpanded);
        break;
      default:
        break;
    }

    // Scroll para a seção
    setTimeout(() => {
      const element = document.querySelector(`[data-section="${sectionName}"]`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  return {
    isAlunoExpanded,
    isResponsavelExpanded,
    isAnamneseExpanded,
    handleSectionToggle
  };
};
