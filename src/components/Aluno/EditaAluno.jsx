import React, { useState } from 'react';
import {
  User,
  Users,
  SwatchBook,
  Dumbbell,
  Settings,
  ChevronDown,
  LogOut,
  Plus,
  Trash2,
  Phone,
  Save,
  X,
} from 'lucide-react';
import './EditaAluno.css';

const imagemJEC = '/img/brasao.png';
const imagemAlunos = '/img/icon_jogador.png';
const imagemCategorias = '/img/icon-categoria.png';
const imagemJogos = '/img/icon_jogos.png';
const imagemTreinos = '/img/icon_treinos.png';
const imagemConfiguracoes = '/img/icon_configurações.png';

const EditaAluno = ({ onLogout }) => {
  // Estado para os campos do formulário
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
    // Campos do responsável
    nomeResponsavel: '',
    cpfResponsavel: '',
    telefoneResponsavel: '',
    grauParentesco: '',
    autorizaJogosForaCidade: '',
    // Contatos de emergência
    contatosEmergencia: [{ nome: '', telefone: '' }],
    // Campos de anamnese
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

  // gerir as secções que podem ser recolhidas
  const [isAlunoExpanded, setIsAlunoExpanded] = useState(true);
  const [isResponsavelExpanded, setIsResponsavelExpanded] = useState(false);
  const [isAnamneseExpanded, setIsAnamneseExpanded] = useState(false);

  // Manipular mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para adicionar novo contato de emergência
  const addContatoEmergencia = () => {
    setFormData((prevData) => ({
      ...prevData,
      contatosEmergencia: [...prevData.contatosEmergencia, { nome: '', telefone: '' }]
    }));
  };

  // Função para remover contato de emergência
  const removeContatoEmergencia = (index) => {
    if (formData.contatosEmergencia.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        contatosEmergencia: prevData.contatosEmergencia.filter((_, i) => i !== index)
      }));
    }
  };

  // Função para atualizar contato de emergência
  const updateContatoEmergencia = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      contatosEmergencia: prevData.contatosEmergencia.map((contato, i) => 
        i === index ? { ...contato, [field]: value } : contato
      )
    }));
  };

  // Função para expandir seção e fazer scroll 
  const handleSectionToggle = (sectionName, isExpanded) => {
    if (sectionName === 'aluno') {
      setIsAlunoExpanded(!isAlunoExpanded);
    } else if (sectionName === 'responsavel') {
      setIsResponsavelExpanded(!isResponsavelExpanded);
    } else if (sectionName === 'anamnese') {
      setIsAnamneseExpanded(!isAnamneseExpanded);
    }

    // Scroll 
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
  

  // Manipular o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Aluno Editado:', formData);
    

    const message = document.createElement('div');
    message.innerText = 'Aluno atualizado com sucesso! Verifique o console para ver os dados.';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--primary-color);
      color: white;
      padding: 20px 40px;
      border-radius: 10px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(message);
    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);
  };

  return (
    <div className="student-search-container">
      <header className="header">
        <div className="logo">
          <img src={imagemJEC} alt="Brasão do Clube" className="logo-image" />
        </div>

        <nav className="main-nav">
          <div className="nav-item active">
             <div className="nav-icon"><img src={imagemAlunos} alt="Ícone de alunos" /></div>
            <span>Alunos</span>
          </div>
          <div className="nav-item">
             <div className="nav-icon"><img src={imagemCategorias} alt="Ícone de categorias" /></div>
            <span>Categorias</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon"><img src={imagemJogos} alt="Ícone de jogos" /></div>
            <span>Jogos</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon"><img src={imagemTreinos} alt="Ícone de treinos" /></div>
            <span>Treinos</span>
          </div>
        <div className="nav-item">
            <div className="nav-icon"><img src={imagemConfiguracoes} alt="Ícone de configurações" /></div>
            <span>Configurações</span>
          </div>
        </nav>
        <button className="exit-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Barra lateral */}
        <aside className="sidebar">
          <div className="sidebar-item">
            <div className="sidebar-icon">
              <User size={24} />
            </div>
            <span>Cadastrar Aluno</span>
          </div>
          <div className="sidebar-item">
            <div className="sidebar-icon">
              <Users size={24} />
            </div>
            <span>Buscar Aluno</span>
          </div>
        </aside>

        {/* Painel Principal */}
        <section className="main-panel">
          <h1 className="panel-title">Edição de Alunos</h1>
          <form className="registration-form" onSubmit={handleSubmit}>
            
            {/* Seção de Dados do Aluno */}
            <div 
              className="form-section-header" 
              onClick={() => handleSectionToggle('aluno', isAlunoExpanded)}
              data-section="aluno"
            >
              <span>Dados do Aluno</span>
              <ChevronDown size={24} className={`chevron ${isAlunoExpanded ? 'expanded' : ''}`} />
            </div>
            {isAlunoExpanded && (
              <div className="form-content">
                {/* Nome do Aluno */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="nomeAluno">Nome do Aluno</label>
                    <input
                      type="text"
                      id="nomeAluno"
                      name="nomeAluno"
                      value={formData.nomeAluno}
                      onChange={handleInputChange}
                      placeholder="Nome completo do aluno"
                      required
                    />
                  </div>
                </div>

                {/* Data de Nascimento e Gênero */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dataNascimento">Data Nascimento:</label>
                    <input
                      type="date"
                      id="dataNascimento"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="genero">Gênero:</label>
                    <select
                      id="genero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>
                </div>

                {/* Telefones */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone:</label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefone2">Telefone:</label>
                    <input
                      type="tel"
                      id="telefone2"
                      name="telefone2"
                      value={formData.telefone2}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* CPF e RG */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cpf">CPF:</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rg">RG:</label>
                    <input
                      type="text"
                      id="rg"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                      placeholder="00.000.000-0"
                      required
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="rua">Rua:</label>
                    <input
                      type="text"
                      id="rua"
                      name="rua"
                      value={formData.rua}
                      onChange={handleInputChange}
                      placeholder="Nome da rua"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleInputChange}
                      placeholder="Nome do bairro"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="Nome da cidade"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cep">CEP:</label>
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>
              </div>
            )}


            {/*  Dados do Responsável */}
            <div 
              className="form-section-header" 
              onClick={() => handleSectionToggle('responsavel', isResponsavelExpanded)}
              data-section="responsavel"
            >
              <span>Dados do Responsável</span>
              <ChevronDown size={24} className={`chevron ${isResponsavelExpanded ? 'expanded' : ''}`} />
            </div>
            {isResponsavelExpanded && (
              <div className="form-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nomeResponsavel">Nome do Responsável</label>
                    <input
                      type="text"
                      id="nomeResponsavel"
                      name="nomeResponsavel"
                      value={formData.nomeResponsavel}
                      onChange={handleInputChange}
                      placeholder="Nome do Responsável"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cpfResponsavel">CPF do Responsável</label>
                    <input
                      type="text"
                      id="cpfResponsavel"
                      name="cpfResponsavel"
                      value={formData.cpfResponsavel}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefoneResponsavel">Telefone do Responsável</label>
                    <input
                      type="tel"
                      id="telefoneResponsavel"
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="grauParentesco">Grau de Parentesco</label>
                    <select
                      id="grauParentesco"
                      name="grauParentesco"
                      value={formData.grauParentesco}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="pai">Pai</option>
                      <option value="mae">Mãe</option>
                      <option value="avo">Avô/Avó</option>
                      <option value="tio">Tio/Tia</option>
                      <option value="irmao">Irmão/Irmã</option>
                      <option value="responsavel">Responsável Legal</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
                
                {/* Contatos de Emergência */}
                <div className="form-section-subtitle">
                  <h3>Contatos de Emergência</h3>
                </div>
                {formData.contatosEmergencia.map((contato, index) => (
                  <div key={index} className="contato-emergencia-group">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`contatoNome${index}`}>Nome do Contato {index + 1}</label>
                        <input
                          type="text"
                          id={`contatoNome${index}`}
                          value={contato.nome}
                          onChange={(e) => updateContatoEmergencia(index, 'nome', e.target.value)}
                          placeholder="Nome completo"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`contatoTelefone${index}`}>Telefone do Contato {index + 1}</label>
                        <input
                          type="tel"
                          id={`contatoTelefone${index}`}
                          value={contato.telefone}
                          onChange={(e) => updateContatoEmergencia(index, 'telefone', e.target.value)}
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                      {formData.contatosEmergencia.length > 1 && (
                        <div className="form-group-remove">
                          <button
                            type="button"
                            className="remove-contato-btn"
                            onClick={() => removeContatoEmergencia(index)}
                            title="Remover contato"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="form-row">
                  <button
                    type="button"
                    className="add-contato-btn"
                    onClick={addContatoEmergencia}
                  >
                    <Plus size={16} />
                    Adicionar Contato de Emergência
                  </button>
                </div>

                {/* Autorização para jogos fora da cidade */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Autoriza participar de jogos fora da cidade?</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="autorizaJogosForaCidade"
                          value="sim"
                          checked={formData.autorizaJogosForaCidade === 'sim'}
                          onChange={handleInputChange}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="autorizaJogosForaCidade"
                          value="nao"
                          checked={formData.autorizaJogosForaCidade === 'nao'}
                          onChange={handleInputChange}
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}






            {/* Anamnese */}
            <div 
              className="form-section-header" 
              onClick={() => handleSectionToggle('anamnese', isAnamneseExpanded)}
              data-section="anamnese"
            >
              <span>Anamnese</span>
              <ChevronDown size={24} className={`chevron ${isAnamneseExpanded ? 'expanded' : ''}`} />
            </div>
            {isAnamneseExpanded && (
              <div className="form-content">
                {/* Tipo Sanguíneo */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tipoSanguineo">Tipo Sanguíneo</label>
                    <select
                      id="tipoSanguineo"
                      name="tipoSanguineo"
                      value={formData.tipoSanguineo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Possui Alergias */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Possui alergias?</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="possuiAlergias"
                          value="sim"
                          checked={formData.possuiAlergias === 'sim'}
                          onChange={handleInputChange}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="possuiAlergias"
                          value="nao"
                          checked={formData.possuiAlergias === 'nao'}
                          onChange={handleInputChange}
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.possuiAlergias === 'sim' && (
                  <div className="form-row conditional-field">
                    <div className="form-group full-width">
                      <label htmlFor="detalhesAlergias">Detalhes das Alergias</label>
                      <textarea
                        id="detalhesAlergias"
                        name="detalhesAlergias"
                        value={formData.detalhesAlergias}
                        onChange={handleInputChange}
                        placeholder="Descreva as alergias conhecidas..."
                        required
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Possui Doença */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Possui alguma doença?</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="possuiDoenca"
                          value="sim"
                          checked={formData.possuiDoenca === 'sim'}
                          onChange={handleInputChange}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="possuiDoenca"
                          value="nao"
                          checked={formData.possuiDoenca === 'nao'}
                          onChange={handleInputChange}
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.possuiDoenca === 'sim' && (
                  <div className="conditional-field">
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label htmlFor="detalhesDoenca">Detalhes da Doença</label>
                        <textarea
                          id="detalhesDoenca"
                          name="detalhesDoenca"
                          value={formData.detalhesDoenca}
                          onChange={handleInputChange}
                          placeholder="Descreva a doença..."
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Está tratando a doença?</label>
                        <div className="radio-group">
                          <label className="radio-option">
                            <input
                              type="radio"
                              name="estaTratandoDoenca"
                              value="sim"
                              checked={formData.estaTratandoDoenca === 'sim'}
                              onChange={handleInputChange}
                            />
                            <span>Sim</span>
                          </label>
                          <label className="radio-option">
                            <input
                              type="radio"
                              name="estaTratandoDoenca"
                              value="nao"
                              checked={formData.estaTratandoDoenca === 'nao'}
                              onChange={handleInputChange}
                            />
                            <span>Não</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesão Ortopédica */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Já teve lesão ortopédica?</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="teveLesaoOrtopedica"
                          value="sim"
                          checked={formData.teveLesaoOrtopedica === 'sim'}
                          onChange={handleInputChange}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="teveLesaoOrtopedica"
                          value="nao"
                          checked={formData.teveLesaoOrtopedica === 'nao'}
                          onChange={handleInputChange}
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.teveLesaoOrtopedica === 'sim' && (
                  <div className="form-row conditional-field">
                    <div className="form-group full-width">
                      <label htmlFor="detalhesLesao">Detalhes da Lesão</label>
                      <textarea
                        id="detalhesLesao"
                        name="detalhesLesao"
                        value={formData.detalhesLesao}
                        onChange={handleInputChange}
                        placeholder="Descreva a lesão ortopédica..."
                        required
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Cirurgia */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Já passou por cirurgia?</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="passouPorCirurgia"
                          value="sim"
                          checked={formData.passouPorCirurgia === 'sim'}
                          onChange={handleInputChange}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="passouPorCirurgia"
                          value="nao"
                          checked={formData.passouPorCirurgia === 'nao'}
                          onChange={handleInputChange}
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.passouPorCirurgia === 'sim' && (
                  <div className="form-row conditional-field">
                    <div className="form-group full-width">
                      <label htmlFor="detalhesCirurgia">Detalhes da Cirurgia</label>
                      <textarea
                        id="detalhesCirurgia"
                        name="detalhesCirurgia"
                        value={formData.detalhesCirurgia}
                        onChange={handleInputChange}
                        placeholder="Descreva a cirurgia realizada..."
                        required
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Medicamento Contínuo */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Faz uso contínuo de algum medicamento?</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="usaMedicamentoContinuo"
                          value="sim"
                          checked={formData.usaMedicamentoContinuo === 'sim'}
                          onChange={handleInputChange}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="usaMedicamentoContinuo"
                          value="nao"
                          checked={formData.usaMedicamentoContinuo === 'nao'}
                          onChange={handleInputChange}
                        />
                        <span>Não</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.usaMedicamentoContinuo === 'sim' && (
                  <div className="form-row conditional-field">
                    <div className="form-group full-width">
                      <label htmlFor="detalhesMedicamento">Detalhes do Medicamento</label>
                      <textarea
                        id="detalhesMedicamento"
                        name="detalhesMedicamento"
                        value={formData.detalhesMedicamento}
                        onChange={handleInputChange}
                        placeholder="Descreva o medicamento e posologia..."
                        required
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Anamnese Geral */}
                <div className="form-section-subtitle">
                  <h3>Observações Gerais</h3>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="anamnese">Anamnese do Aluno</label>
                    <textarea
                      id="anamnese"
                      name="anamnese"
                      value={formData.anamnese}
                      onChange={handleInputChange}
                      placeholder="Insira aqui outras informações relevantes da anamnese..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}





            {/* Botões */}
            <div className="btn-container">
              <button type="submit" className="submit-btn">
                <Save size={16} />
                Atualizar
              </button>
              <button type="button" className="cancel-btn">
                <X size={16} />
                Cancelar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EditaAluno;