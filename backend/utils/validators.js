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
  
  module.exports = {
    validarCPF,
    formatarCPF,
    validarTelefone,
    validarCEP,
    calcularIdade,
    determinarCategoriaIdade
  };