import React, { useState } from 'react';
import { ArrowLeft, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../../components/Header/Header';
import GamesSidebar from '../../components/GamesSidebar/GamesSidebar';
import './CadastrarJogo.css';

const CadastrarJogo = ({ onLogout, onNavigate }) => {
  const [formData, setFormData] = useState({
    time1: '',
    time2: '',
    local: '',
    cidade: '',
    data: '',
    horario: '',
    id: '',
    tipo: '',
    cep: '',
    uf: '',
    categoria: ''
  });

  const [juizes, setJuizes] = useState(['']);

  // Categorias pré-definidas (será conectado à página de categorias futuramente)
  // TODO: Quando a página de categorias for criada, substituir este array por:
  // const categorias = await fetchCategorias(); // ou similar
  const categorias = [
    'Sub-6',
    'Sub-7', 
    'Sub-8',
    'Sub-9',
    'Sub-10',
    'Sub-11',
    'Sub-12',
    'Sub-13',
    'Sub-14',
    'Sub-15',
    'Sub-16',
    'Sub-17',
    'Sub-18',
    'Sub-19',
    'Sub-20'
  ];

  const [lineup, setLineup] = useState([
    { nome: '', categoria: '' },
    { nome: '', categoria: '' },
    { nome: '', categoria: '' }
  ]);

  // Jogadores pré-cadastrados para autocomplete (será conectado ao banco de dados futuramente)
  // TODO: Quando o sistema de jogadores for implementado, substituir por:
  // const jogadores = await fetchJogadores(); // ou similar
  const jogadoresCadastrados = [
    'João Silva',
    'Pedro Santos',
    'Carlos Oliveira',
    'Lucas Ferreira',
    'Rafael Costa',
    'Gabriel Alves',
    'Felipe Rodrigues',
    'Bruno Lima',
    'Diego Souza',
    'André Martins',
    'Thiago Pereira',
    'Marcos Nunes',
    'Vinicius Rocha',
    'Daniel Barbosa',
    'Eduardo Campos'
  ];

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    lineup: true
  });

  const [suggestions, setSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineupChange = (index, field, value) => {
    const newLineup = [...lineup];
    newLineup[index] = {
      ...newLineup[index],
      [field]: value
    };
    setLineup(newLineup);

    // Se for o campo nome, ativar autocomplete
    if (field === 'nome') {
      handleNomeChange(index, value);
    }
  };

  const handleNomeChange = (index, value) => {
    const newLineup = [...lineup];
    newLineup[index] = {
      ...newLineup[index],
      nome: value
    };
    setLineup(newLineup);

    // Filtrar sugestões baseado no que foi digitado
    if (value.length > 0) {
      const filtered = jogadoresCadastrados.filter(jogador =>
        jogador.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(prev => ({
        ...prev,
        [index]: filtered
      }));
      setShowSuggestions(prev => ({
        ...prev,
        [index]: true
      }));
    } else {
      setShowSuggestions(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };

  const selectSuggestion = (index, suggestion) => {
    const newLineup = [...lineup];
    newLineup[index] = {
      ...newLineup[index],
      nome: suggestion
    };
    setLineup(newLineup);
    setShowSuggestions(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handleJuizChange = (index, value) => {
    const newJuizes = [...juizes];
    newJuizes[index] = value;
    setJuizes(newJuizes);
  };

  const addJuiz = () => {
    setJuizes([...juizes, '']);
  };

  const removeJuiz = (index) => {
    if (juizes.length > 1) {
      const newJuizes = juizes.filter((_, i) => i !== index);
      setJuizes(newJuizes);
    }
  };

  const addLineupPlayer = () => {
    setLineup([...lineup, { nome: '', categoria: '' }]);
  };

  const removeLineupPlayer = (index) => {
    if (lineup.length > 1) {
      const newLineup = lineup.filter((_, i) => i !== index);
      setLineup(newLineup);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do jogo:', formData);
    console.log('Escalação:', lineup);
    console.log('Juízes:', juizes);
    // Aqui você implementaria a lógica de salvamento
    alert('Jogo cadastrado com sucesso!');
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('jogos-menu');
    }
  };

  const handleVoltar = () => {
    if (onNavigate) {
      onNavigate('jogos-menu');
    }
  };

  const handleEditar = () => {
    // Aqui você implementaria a lógica de edição
    console.log('Editar jogo');
  };

  const handleRemover = () => {
    // Aqui você implementaria a lógica de remoção
    console.log('Remover jogo');
  };

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Jogos" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <GamesSidebar 
          activeItem="Cadastrar Jogo" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Cadastrar jogo</h1>
          
          <div className="form-container">
            <form onSubmit={handleSubmit} className="game-form">
            {/* Seção de Detalhes do Jogo */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('details')}
              >
                Detalhes do Jogo
                {expandedSections.details ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.details && (
                <div className="section-content">
                  <div className="form-row">
                <div className="form-group">
                  <label htmlFor="time1">Time 1</label>
                  <input
                    id="time1"
                    type="text"
                    value={formData.time1}
                    onChange={(e) => handleInputChange('time1', e.target.value)}
                    placeholder="Nome do time 1"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time2">Time 2</label>
                  <input
                    id="time2"
                    type="text"
                    value={formData.time2}
                    onChange={(e) => handleInputChange('time2', e.target.value)}
                    placeholder="Nome do time 2"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="local">Local</label>
                  <input
                    id="local"
                    type="text"
                    value={formData.local}
                    onChange={(e) => handleInputChange('local', e.target.value)}
                    placeholder="Local do jogo"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="data">Data</label>
                  <input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horario">Horário</label>
                  <input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => handleInputChange('horario', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="categoria">Categoria</label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    id="cidade"
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="id">ID</label>
                  <input
                    id="id"
                    type="text"
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    placeholder="ID do jogo"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipo">Tipo:</label>
                  <input
                    id="tipo"
                    type="text"
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    placeholder="Tipo do jogo"
                  />
                </div>
                
                <div className="form-group">
                  <label>Juízes:</label>
                  <div className="juizes-container">
                    {juizes.map((juiz, index) => (
                      <div key={index} className="juiz-row">
                        <input
                          type="text"
                          value={juiz}
                          onChange={(e) => handleJuizChange(index, e.target.value)}
                          placeholder="Nome do juiz"
                        />
                        {juizes.length > 1 && (
                          <button
                            type="button"
                            className="remove-juiz-btn"
                            onClick={() => removeJuiz(index)}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-juiz-btn"
                      onClick={addJuiz}
                    >
                      Adicionar Juiz
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cep">CEP:</label>
                  <input
                    id="cep"
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    placeholder="CEP"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="uf">UF:</label>
                  <input
                    id="uf"
                    type="text"
                    value={formData.uf}
                    onChange={(e) => handleInputChange('uf', e.target.value)}
                    placeholder="UF"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="categoria">Categoria</label>
                  <input
                    id="categoria"
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    placeholder="Categoria"
                  />
                </div>
              </div>
                </div>
              )}
            </div>

            {/* Seção de Escalação */}
            <div className="form-section">
              <h2 
                className="section-title clickable" 
                onClick={() => toggleSection('lineup')}
              >
                Escalação
                {expandedSections.lineup ? 
                  <ChevronUp size={20} className="collapse-icon" /> : 
                  <ChevronDown size={20} className="collapse-icon" />
                }
              </h2>
              
              {expandedSections.lineup && (
                <div className="section-content">
                  {lineup.map((player, index) => (
                <div key={index} className="lineup-row">
                  <div className="form-group autocomplete-container">
                    <label htmlFor={`nome-${index}`}>Nome</label>
                    <input
                      id={`nome-${index}`}
                      type="text"
                      value={player.nome}
                      onChange={(e) => handleLineupChange(index, 'nome', e.target.value)}
                      placeholder="Nome do jogador"
                      autoComplete="off"
                    />
                    {showSuggestions[index] && suggestions[index] && suggestions[index].length > 0 && (
                      <div className="suggestions-dropdown">
                        {suggestions[index].map((suggestion, suggestionIndex) => (
                          <div
                            key={suggestionIndex}
                            className="suggestion-item"
                            onClick={() => selectSuggestion(index, suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`categoria-${index}`}>Categoria</label>
                    <select
                      id={`categoria-${index}`}
                      value={player.categoria}
                      onChange={(e) => handleLineupChange(index, 'categoria', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {lineup.length > 1 && (
                    <button
                      type="button"
                      className="remove-player-btn"
                      onClick={() => removeLineupPlayer(index)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
                  <button
                    type="button"
                    className="add-player-btn"
                    onClick={addLineupPlayer}
                  >
                    Adicionar Jogador
                  </button>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="action-buttons">
              <button type="submit" className="action-btn salvar-btn">
                <Save size={16} />
                SALVAR
              </button>
              <button type="button" className="action-btn cancelar-btn" onClick={handleVoltar}>
                <X size={16} />
                CANCELAR
              </button>
            </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CadastrarJogo;
