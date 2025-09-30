import { useState } from 'react';

export const useFormSections = () => {
  const [expandedSections, setExpandedSections] = useState({
    aluno: true,
    responsavel: false,
    anamnese: false
  });

  const handleSectionToggle = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const expandAllSections = () => {
    setExpandedSections({
      aluno: true,
      responsavel: true,
      anamnese: true
    });
  };

  const collapseAllSections = () => {
    setExpandedSections({
      aluno: false,
      responsavel: false,
      anamnese: false
    });
  };

  return {
    isAlunoExpanded: expandedSections.aluno,
    isResponsavelExpanded: expandedSections.responsavel,
    isAnamneseExpanded: expandedSections.anamnese,
    handleSectionToggle,
    expandAllSections,
    collapseAllSections
  };
};