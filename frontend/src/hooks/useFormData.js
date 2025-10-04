import { useState } from 'react';

export const useFormData = (initialData = {}) => {
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
    ...initialData
  });

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
