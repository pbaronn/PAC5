import React from 'react';
import { Save, X, Eye, Edit } from 'lucide-react';
import FormSection from '../FormSection/FormSection';
import FormField from '../FormField/FormField';
import RadioGroup from '../RadioGroup/RadioGroup';
import ContatoEmergencia from '../ContatoEmergencia/ContatoEmergencia';
import { useFormData } from '../../hooks/useFormData';
import { useFormSections } from '../../hooks/useFormSections';
import { useStudents } from '../../hooks/useStudents';
import './StudentForm.css';

const StudentForm = ({
  title = 'Cadastro de Alunos',
  submitButtonText = 'Salvar',
  onSubmit,
  initialData = {},
  viewMode = false,
  editMode = false,
  disabled = false
}) => {
  const { categories } = useStudents();
  const {
    formData,
    handleInputChange,
    addContatoEmergencia,
    removeContatoEmergencia,
    updateContatoEmergencia
  } = useFormData(initialData);

  const {
    isAlunoExpanded,
    isResponsavelExpanded,
    isAnamneseExpanded,
    handleSectionToggle
  } = useFormSections();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && (editMode || (!viewMode && !editMode))) {
      // Preparar dados para envio - mapear para formato do backend
      const dataToSubmit = {
        ...formData,
        // Remover campos que não existem no backend ou tratar de forma especial
        contatosEmergencia: undefined, // Remover por enquanto
        // Adicionar campos obrigatórios se não existirem
        category: formData.category || 'Sub-6',
        status: formData.status || 'Ativo'
      };

      console.log('Enviando dados:', dataToSubmit);
      onSubmit(dataToSubmit);
    }
  };

  const isFieldDisabled = disabled || (viewMode && !editMode);

  // Mapear categorias para options
  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: cat
  }));

  return (
    <div className={`form-wrapper ${viewMode ? 'view-mode' : ''} ${editMode ? 'edit-mode' : ''}`}>
      {/* Indicador de modo */}
      {viewMode && (
        <div className={`mode-indicator ${editMode ? 'edit' : 'view'}`}>
          {editMode ? (
            <>
              <Edit size={12} />
              Editando
            </>
          ) : (
            <>
              <Eye size={12} />
              Visualizando
            </>
          )}
        </div>
      )}

      <form className="registration-form" onSubmit={handleSubmit}>
        {/* Seção de Dados do Aluno */}
        <FormSection
          title="Dados do Aluno"
          isExpanded={isAlunoExpanded}
          onToggle={() => handleSectionToggle('aluno')}
          sectionName="aluno"
        >
          <div className="form-row">
            <FormField
              label="CPF"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="Digite o CPF" // ← ALTERADO
              required
              disabled={isFieldDisabled}
            />
          </div>

          <div className="form-row">
            <FormField
              label="CPF do Responsável"
              id="cpfResponsavel"
              name="cpfResponsavel"
              value={formData.cpfResponsavel}
              onChange={handleInputChange}
              placeholder="Digite o CPF do responsável" // ← ALTERADO
              required
              disabled={isFieldDisabled}
            />

            <FormField
              type="select"
              label="Gênero"
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              required
              disabled={isFieldDisabled}
              options={[
                { value: 'masculino', label: 'Masculino' },
                { value: 'feminino', label: 'Feminino' },
                { value: 'outro', label: 'Outro' }
              ]}
            />
          </div>

          <div className="form-row">
            <FormField
              type="tel"
              label="Telefone"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              required
              disabled={isFieldDisabled}
            />

            <FormField
              type="tel"
              label="Telefone 2"
              id="telefone2"
              name="telefone2"
              value={formData.telefone2}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              disabled={isFieldDisabled}
            />
          </div>

          <div className="form-row">
            <FormField
              label="CPF"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              required
              disabled={isFieldDisabled}
            />

            <FormField
              label="RG"
              id="rg"
              name="rg"
              value={formData.rg}
              onChange={handleInputChange}
              placeholder="00.000.000-0"
              required
              disabled={isFieldDisabled}
            />
          </div>

          <div className="form-row">
            <FormField
              label="Rua"
              id="rua"
              name="rua"
              value={formData.rua}
              onChange={handleInputChange}
              placeholder="Nome da rua e número"
              required
              fullWidth
              disabled={isFieldDisabled}
            />
          </div>

          <div className="form-row">
            <FormField
              label="Bairro"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              placeholder="Nome do bairro"
              required
              disabled={isFieldDisabled}
            />

            <FormField
              label="Cidade"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              placeholder="Nome da cidade"
              required
              disabled={isFieldDisabled}
            />
          </div>

          <div className="form-row">
            <FormField
              label="CEP"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="00000-000"
              required
              disabled={isFieldDisabled}
            />

            <FormField
              type="select"
              label="Categoria"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={isFieldDisabled}
              options={categoryOptions}
            />
          </div>

          <div className="form-row">
            <FormField
              type="select"
              label="Status"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              disabled={isFieldDisabled}
              options={[
                { value: 'Ativo', label: 'Ativo' },
                { value: 'Inativo', label: 'Inativo' }
              ]}
            />
          </div>
        </FormSection>

        {/* Seção de Dados do Responsável */}
        <FormSection
          title="Dados do Responsável"
          isExpanded={isResponsavelExpanded}
          onToggle={() => handleSectionToggle('responsavel')}
          sectionName="responsavel"
        >
          <div className="form-row">
            <FormField
              label="Nome do Responsável"
              id="nomeResponsavel"
              name="nomeResponsavel"
              value={formData.nomeResponsavel}
              onChange={handleInputChange}
              placeholder="Nome do Responsável"
              required
              disabled={isFieldDisabled}
            />

            <FormField
              label="CPF do Responsável"
              id="cpfResponsavel"
              name="cpfResponsavel"
              value={formData.cpfResponsavel}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              required
              disabled={isFieldDisabled}
            />
          </div>

          <div className="form-row">
            <FormField
              type="tel"
              label="Telefone do Responsável"
              id="telefoneResponsavel"
              name="telefoneResponsavel"
              value={formData.telefoneResponsavel}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              required
              disabled={isFieldDisabled}
            />

            <FormField
              type="select"
              label="Grau de Parentesco"
              id="grauParentesco"
              name="grauParentesco"
              value={formData.grauParentesco}
              onChange={handleInputChange}
              required
              disabled={isFieldDisabled}
              options={[
                { value: 'pai', label: 'Pai' },
                { value: 'mae', label: 'Mãe' },
                { value: 'avô', label: 'Avô' },
                { value: 'avó', label: 'Avó' },
                { value: 'tio', label: 'Tio' },
                { value: 'tia', label: 'Tia' },
                { value: 'outro', label: 'Outro' }
              ]}
            />
          </div>

          <ContatoEmergencia
            contatos={formData.contatosEmergencia}
            onAdd={addContatoEmergencia}
            onRemove={removeContatoEmergencia}
            onUpdate={updateContatoEmergencia}
            disabled={isFieldDisabled}
          />

          <div className="form-row">
            <RadioGroup
              label="Autoriza participar de jogos fora da cidade?"
              name="autorizaJogosForaCidade"
              value={formData.autorizaJogosForaCidade}
              onChange={handleInputChange}
              options={[
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ]}
            />
          </div>
        </FormSection>

        {/* Seção de Anamnese */}
        <FormSection
          title="Anamnese"
          isExpanded={isAnamneseExpanded}
          onToggle={() => handleSectionToggle('anamnese')}
          sectionName="anamnese"
        >
          <div className="form-row">
            <FormField
              type="select"
              label="Tipo Sanguíneo"
              id="tipoSanguineo"
              name="tipoSanguineo"
              value={formData.tipoSanguineo}
              onChange={handleInputChange}
              disabled={isFieldDisabled}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' }
              ]}
            />
          </div>

          <div className="form-row">
            <RadioGroup
              label="Possui alergias?"
              name="possuiAlergias"
              value={formData.possuiAlergias}
              onChange={handleInputChange}
            />
          </div>

          {formData.possuiAlergias === 'sim' && (
            <div className="form-row conditional-field">
              <FormField
                type="textarea"
                label="Detalhes das Alergias"
                id="detalhesAlergias"
                name="detalhesAlergias"
                value={formData.detalhesAlergias}
                onChange={handleInputChange}
                placeholder="Descreva as alergias conhecidas..."
                required
                fullWidth
                disabled={isFieldDisabled}
              />
            </div>
          )}

          <div className="form-row">
            <RadioGroup
              label="Possui alguma doença?"
              name="possuiDoenca"
              value={formData.possuiDoenca}
              onChange={handleInputChange}
            />
          </div>

          {formData.possuiDoenca === 'sim' && (
            <div className="conditional-field">
              <div className="form-row">
                <FormField
                  type="textarea"
                  label="Detalhes da Doença"
                  id="detalhesDoenca"
                  name="detalhesDoenca"
                  value={formData.detalhesDoenca}
                  onChange={handleInputChange}
                  placeholder="Descreva a doença..."
                  required
                  fullWidth
                  disabled={isFieldDisabled}
                />
              </div>
              <div className="form-row">
                <RadioGroup
                  label="Está tratando a doença?"
                  name="estaTratandoDoenca"
                  value={formData.estaTratandoDoenca}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="form-section-subtitle">
            <h3>Observações Gerais</h3>
          </div>
          <div className="form-row">
            <FormField
              type="textarea"
              label="Anamnese do Aluno"
              id="anamnese"
              name="anamnese"
              value={formData.anamnese}
              onChange={handleInputChange}
              placeholder="Insira aqui outras informações relevantes da anamnese..."
              fullWidth
              disabled={isFieldDisabled}
            />
          </div>
        </FormSection>

        {/* Botões - só aparecem se não for modo visualização OU se estiver editando */}
        {(!viewMode || editMode) && submitButtonText && (
          <div className="btn-container">
            <button type="submit" className="submit-btn" disabled={disabled}>
              <Save size={16} />
              {disabled ? 'Salvando...' : submitButtonText}
            </button>
            <button type="button" className="cancel-btn" disabled={disabled}>
              <X size={16} />
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentForm;