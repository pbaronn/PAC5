const { connectDB } = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');

const seedData = async () => {
  try {
    // Conectar com MongoDB
    await connectDB();
    console.log('✅ Conectado ao MongoDB!');

    // Limpar dados existentes (cuidado em produção!)
    await User.deleteMany({});
    await Student.deleteMany({});
    console.log('✅ Dados existentes removidos!');

    // Criar usuário admin
    await User.create({
      username: 'admin',
      password: '123',
      name: 'Administrador',
      email: 'admin@sistema.com'
    });
    console.log('✅ Usuário admin criado!');

    // Criar alunos de exemplo
    const students = [
      {
        nomeAluno: 'João Silva',
        dataNascimento: '2017-05-15',
        genero: 'masculino',
        telefone: '(11) 99999-1111',
        telefone2: '(11) 8888-1111',
        cpf: '123.456.789-01',
        rg: '12.345.678-9',
        rua: 'Rua das Flores, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        cep: '01234-567',
        nomeResponsavel: 'Maria Silva',
        cpfResponsavel: '987.654.321-09',
        telefoneResponsavel: '(11) 77777-1111',
        grauParentesco: 'mae',
        category: 'Sub-7',
        status: 'Ativo'
      },
      {
        nomeAluno: 'Maria Santos',
        dataNascimento: '2018-03-22',
        genero: 'feminino',
        telefone: '(11) 99999-2222',
        telefone2: null,
        cpf: '234.567.890-12',
        rg: '23.456.789-0',
        rua: 'Avenida Paulista, 456',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        cep: '01310-000',
        nomeResponsavel: 'José Santos',
        cpfResponsavel: '876.543.210-98',
        telefoneResponsavel: '(11) 66666-2222',
        grauParentesco: 'pai',
        category: 'Sub-6',
        status: 'Ativo'
      },
      {
        nomeAluno: 'Pedro Oliveira',
        dataNascimento: '2016-08-10',
        genero: 'masculino',
        telefone: '(11) 99999-3333',
        telefone2: '(11) 7777-3333',
        cpf: '345.678.901-23',
        rg: '34.567.890-1',
        rua: 'Rua Augusta, 789',
        bairro: 'Consolação',
        cidade: 'São Paulo',
        cep: '01305-100',
        nomeResponsavel: 'Ana Oliveira',
        cpfResponsavel: '765.432.109-87',
        telefoneResponsavel: '(11) 55555-3333',
        grauParentesco: 'mae',
        category: 'Sub-8',
        status: 'Inativo'
      },
      {
        nomeAluno: 'Ana Costa',
        dataNascimento: '2015-12-03',
        genero: 'feminino',
        telefone: '(11) 99999-4444',
        telefone2: null,
        cpf: '456.789.012-34',
        rg: '45.678.901-2',
        rua: 'Rua da Consolação, 321',
        bairro: 'Higienópolis',
        cidade: 'São Paulo',
        cep: '01302-001',
        nomeResponsavel: 'Carlos Costa',
        cpfResponsavel: '654.321.098-76',
        telefoneResponsavel: '(11) 44444-4444',
        grauParentesco: 'pai',
        category: 'Sub-9',
        status: 'Ativo'
      },
      {
        nomeAluno: 'Lucas Ferreira',
        dataNascimento: '2019-01-20',
        genero: 'masculino',
        telefone: '(11) 99999-5555',
        telefone2: '(11) 8888-5555',
        cpf: '567.890.123-45',
        rg: '56.789.012-3',
        rua: 'Alameda Santos, 654',
        bairro: 'Jardins',
        cidade: 'São Paulo',
        cep: '01419-000',
        nomeResponsavel: 'Patricia Ferreira',
        cpfResponsavel: '543.210.987-65',
        telefoneResponsavel: '(11) 33333-5555',
        grauParentesco: 'mae',
        category: 'Sub-6',
        status: 'Ativo'
      }
    ];

    await Student.insertMany(students);
    console.log('✅ Alunos de exemplo criados!');

    console.log('\n🎉 Seed executado com sucesso!');
    console.log('📱 Dados para login:');
    console.log('   Usuário: admin');
    console.log('   Senha: 123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seedData();