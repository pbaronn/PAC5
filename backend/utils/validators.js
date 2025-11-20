const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto < 2 ? 0 : resto;
    
    // Verifica o primeiro dígito
    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) return false;
    
    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto < 2 ? 0 : resto;
    
    // Verifica o segundo dígito
    return parseInt(cpf.charAt(10)) === digitoVerificador2;
  };
  
  const formatarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  const validarTelefone = (telefone) => {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return telefoneRegex.test(telefone);
  };
  
  const validarCEP = (cep) => {
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(cep);
  };
  
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };
  
  const determinarCategoriaIdade = (dataNascimento) => {
    const idade = calcularIdade(dataNascimento);
    return `Sub-${idade + 1}`;
  };

  // Validações específicas para jogos
  const validarHorario = (horario) => {
    const horarioRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return horarioRegex.test(horario);
  };

  const formatarCEP = (cep) => {
    cep = cep.replace(/[^\d]/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const validarUF = (uf) => {
    const ufsValidas = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    return ufsValidas.includes(uf.toUpperCase());
  };

  const validarDataJogo = (dataJogo) => {
    const data = new Date(dataJogo);
    const hoje = new Date();
    
    // Verifica se a data é válida
    if (isNaN(data.getTime())) {
      return { valido: false, erro: 'Data inválida' };
    }

    // Verifica se a data não é muito antiga (mais de 1 ano no passado)
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
    
    if (data < umAnoAtras) {
      return { valido: false, erro: 'Data do jogo não pode ser anterior a um ano' };
    }

    // Verifica se a data não é muito distante (mais de 2 anos no futuro)
    const doisAnosFrente = new Date();
    doisAnosFrente.setFullYear(doisAnosFrente.getFullYear() + 2);
    
    if (data > doisAnosFrente) {
      return { valido: false, erro: 'Data do jogo não pode ser superior a dois anos' };
    }

    return { valido: true };
  };

  const validarTipoJogo = (tipo) => {
    const tiposValidos = ['amistoso', 'campeonato', 'torneio', 'copa', 'festival', 'treino'];
    return tiposValidos.includes(tipo.toLowerCase());
  };

  // Função para buscar endereço por CEP (pode ser implementada com API externa)
  const buscarEnderecoPorCEP = async (cep) => {
    try {
      // Implementação futura com API dos Correios ou ViaCEP
      // Por enquanto retorna null para deixar o usuário preencher manualmente
      return null;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  };
  
  module.exports = {
    validarCPF,
    formatarCPF,
    validarTelefone,
    validarCEP,
    calcularIdade,
    determinarCategoriaIdade,
    validarHorario,
    formatarCEP,
    validarUF,
    validarDataJogo,
    validarTipoJogo,
    buscarEnderecoPorCEP
  };