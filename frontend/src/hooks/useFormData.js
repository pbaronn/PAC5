import { useState, useEffect } from 'react';

export const useFormData = (initialData = {}) => {
  // Função para formatar data para o input HTML (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      
      // Formato ISO string e pegar apenas a parte da data
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // Processamento dos dados iniciais
  const processedInitialData = {
    ...initialData,
    // Formatar data de nascimento para input HTML
    dataNascimento: formatDateForInput(initialData.dataNascimento)
  };

  const [formData, setFormData] = useState({
    nomeAluno: '',
    dataNascimento: '',
    genero: '',
    telefone: '',
    telefone2: '',
    cpf: '',
    rg: '',
    rua: '',
    bairro: '',
    cidade: '',
    cep: '',
    observacoes: '',
    nomeResponsavel: '',
    cpfResponsavel: '',
    telefoneResponsavel: '',
    grauParentesco: '',
    autorizaJogosForaCidade: '',
    contatosEmergencia: [{ nome: '', telefone: '' }],
    possuiAlergias: '',
    detalhesAlergias: '',
    possuiDoenca: '',
    detalhesDoenca: '',
    estaTratandoDoenca: '',
    teveLesaoOrtopedica: '',
    detalhesLesao: '',
    passouPorCirurgia: '',
    detalhesCirurgia: '',
    usaMedicamentoContinuo: '',
    detalhesMedicamento: '',
    tipoSanguineo: '',
    ...processedInitialData
  });

  // Atualizar formData quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const newProcessedData = {
        ...initialData,
        dataNascimento: formatDateForInput(initialData.dataNascimento)
      };
      
      setFormData(prevData => ({
        ...prevData,
        ...newProcessedData
      }));
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addContatoEmergencia = () => {
    setFormData((prevData) => ({
      ...prevData,
      contatosEmergencia: [...prevData.contatosEmergencia, { nome: '', telefone: '' }]
    }));
  };

  const removeContatoEmergencia = (index) => {
    if (formData.contatosEmergencia.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        contatosEmergencia: prevData.contatosEmergencia.filter((_, i) => i !== index)
      }));
    }
  };

  const updateContatoEmergencia = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      contatosEmergencia: prevData.contatosEmergencia.map((contato, i) => 
        i === index ? { ...contato, [field]: value } : contato
      )
    }));
  };

  const resetForm = () => {
    setFormData({
      nomeAluno: '',
      dataNascimento: '',
      genero: '',
      telefone: '',
      telefone2: '',
      cpf: '',
      rg: '',
      rua: '',
      bairro: '',
      cidade: '',
      cep: '',
      observacoes: '',
      nomeResponsavel: '',
      cpfResponsavel: '',
      telefoneResponsavel: '',
      grauParentesco: '',
      autorizaJogosForaCidade: '',
      contatosEmergencia: [{ nome: '', telefone: '' }],
      possuiAlergias: '',
      detalhesAlergias: '',
      possuiDoenca: '',
      detalhesDoenca: '',
      estaTratandoDoenca: '',
      teveLesaoOrtopedica: '',
      detalhesLesao: '',
      passouPorCirurgia: '',
      detalhesCirurgia: '',
      usaMedicamentoContinuo: '',
      detalhesMedicamento: '',
      tipoSanguineo: ''
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    addContatoEmergencia,
    removeContatoEmergencia,
    updateContatoEmergencia,
    resetForm
  };
};
