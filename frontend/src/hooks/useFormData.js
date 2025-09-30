import { useState, useEffect } from 'react';

export const useFormData = (initialData = {}) => {
  const [formData, setFormData] = useState({
    // Dados do Aluno
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
    
    // Dados do Responsável
    nomeResponsavel: '',
    cpfResponsavel: '',
    telefoneResponsavel: '',
    grauParentesco: '',
    
    // Contatos de Emergência (não está no backend ainda, mas mantemos no frontend)
    contatosEmergencia: [
      { nome: '', telefone: '' }
    ],
    autorizaJogosForaCidade: 'nao',
    
    // Anamnese (campos extras não mapeados no backend ainda)
    tipoSanguineo: '',
    possuiAlergias: 'nao',
    detalhesAlergias: '',
    possuiDoenca: 'nao',
    detalhesDoenca: '',
    estaTratandoDoenca: 'nao',
    teveLesaoOrtopedica: 'nao',
    detalhesLesao: '',
    passouPorCirurgia: 'nao',
    detalhesCirurgia: '',
    usaMedicamentoContinuo: 'nao',
    detalhesMedicamento: '',
    anamnese: '',
    
    // Campos do sistema
    category: '',
    status: 'Ativo'
  });

  // Atualizar formData quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        // Garantir que campos obrigatórios existam
        contatosEmergencia: initialData.contatosEmergencia || [{ nome: '', telefone: '' }],
        // Mapear campos do backend para frontend se necessário
        nomeAluno: initialData.nomeAluno || initialData.name || '',
      }));
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addContatoEmergencia = () => {
    setFormData(prev => ({
      ...prev,
      contatosEmergencia: [...prev.contatosEmergencia, { nome: '', telefone: '' }]
    }));
  };

  const removeContatoEmergencia = (index) => {
    setFormData(prev => ({
      ...prev,
      contatosEmergencia: prev.contatosEmergencia.filter((_, i) => i !== index)
    }));
  };

  const updateContatoEmergencia = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contatosEmergencia: prev.contatosEmergencia.map((contato, i) => 
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
      nomeResponsavel: '',
      cpfResponsavel: '',
      telefoneResponsavel: '',
      grauParentesco: '',
      contatosEmergencia: [{ nome: '', telefone: '' }],
      autorizaJogosForaCidade: 'nao',
      tipoSanguineo: '',
      possuiAlergias: 'nao',
      detalhesAlergias: '',
      possuiDoenca: 'nao',
      detalhesDoenca: '',
      estaTratandoDoenca: 'nao',
      teveLesaoOrtopedica: 'nao',
      detalhesLesao: '',
      passouPorCirurgia: 'nao',
      detalhesCirurgia: '',
      usaMedicamentoContinuo: 'nao',
      detalhesMedicamento: '',
      anamnese: '',
      category: '',
      status: 'Ativo'
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