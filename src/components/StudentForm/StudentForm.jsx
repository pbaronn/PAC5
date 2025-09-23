import React from 'react';
import { Save, X } from 'lucide-react';
import FormSection from '../FormSection/FormSection';
import FormField from '../FormField/FormField';
import RadioGroup from '../RadioGroup/RadioGroup';
import ContatoEmergencia from '../ContatoEmergencia/ContatoEmergencia';
import { useFormData } from '../../hooks/useFormData';
import { useFormSections } from '../../hooks/useFormSections';
import './StudentForm.css';

const StudentForm = ({ 
  title = 'Cadastro de Alunos',
  submitButtonText = 'Salvar',
  onSubmit,
  initialData = {}
}) => {
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
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{title}</h2>
      
      {/* Seção de Dados do Aluno */}
      <FormSection
        title="Dados do Aluno"
        isExpanded={isAlunoExpanded}
        onToggle={() => handleSectionToggle('aluno')}
        sectionName="aluno"
      >
        <div className="form-row">
          <FormField
            label="Nome do Aluno"
            id="nomeAluno"
            name="nomeAluno"
            value={formData.nomeAluno}
            onChange={handleInputChange}
            placeholder="Nome completo do aluno"
            required
            fullWidth
          />
        </div>

        <div className="form-row">
          <FormField
            type="date"
            label="Data Nascimento"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            required
          />
          
          <FormField
            type="select"
            label="Gênero"
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
            required
            options={[
              { value: 'masculino', label: 'Masculino' },
              { value: 'feminino', label: 'Feminino' }
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
          />
          
          <FormField
            type="tel"
            label="Telefone 2"
            id="telefone2"
            name="telefone2"
            value={formData.telefone2}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
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
          />
          
          <FormField
            label="RG"
            id="rg"
            name="rg"
            value={formData.rg}
            onChange={handleInputChange}
            placeholder="00.000.000-0"
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="Rua"
            id="rua"
            name="rua"
            value={formData.rua}
            onChange={handleInputChange}
            placeholder="Nome da rua"
            required
            fullWidth
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
            fullWidth
          />
        </div>

        <div className="form-row">
          <FormField
            label="Cidade"
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleInputChange}
            placeholder="Nome da cidade"
            required
          />
          
          <FormField
            label="CEP"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleInputChange}
            placeholder="00000-000"
            required
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
          />
          
          <FormField
            label="CPF do Responsável"
            id="cpfResponsavel"
            name="cpfResponsavel"
            value={formData.cpfResponsavel}
            onChange={handleInputChange}
            placeholder="000.000.000-00"
            required
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
          />
          
          <FormField
            type="select"
            label="Grau de Parentesco"
            id="grauParentesco"
            name="grauParentesco"
            value={formData.grauParentesco}
            onChange={handleInputChange}
            required
            options={[
              { value: 'pai', label: 'Pai' },
              { value: 'mae', label: 'Mãe' },
              { value: 'avo', label: 'Avô/Avó' },
              { value: 'tio', label: 'Tio/Tia' },
              { value: 'irmao', label: 'Irmão/Irmã' },
              { value: 'responsavel', label: 'Responsável Legal' },
              { value: 'outro', label: 'Outro' }
            ]}
          />
        </div>

        <ContatoEmergencia
          contatos={formData.contatosEmergencia}
          onAdd={addContatoEmergencia}
          onRemove={removeContatoEmergencia}
          onUpdate={updateContatoEmergencia}
        />

        <div className="form-row">
          <RadioGroup
            label="Autoriza participar de jogos fora da cidade?"
            name="autorizaJogosForaCidade"
            value={formData.autorizaJogosForaCidade}
            onChange={handleInputChange}
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
            required
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

        <div className="form-row">
          <RadioGroup
            label="Já teve lesão ortopédica?"
            name="teveLesaoOrtopedica"
            value={formData.teveLesaoOrtopedica}
            onChange={handleInputChange}
          />
        </div>

        {formData.teveLesaoOrtopedica === 'sim' && (
          <div className="form-row conditional-field">
            <FormField
              type="textarea"
              label="Detalhes da Lesão"
              id="detalhesLesao"
              name="detalhesLesao"
              value={formData.detalhesLesao}
              onChange={handleInputChange}
              placeholder="Descreva a lesão ortopédica..."
              required
              fullWidth
            />
          </div>
        )}

        <div className="form-row">
          <RadioGroup
            label="Já passou por cirurgia?"
            name="passouPorCirurgia"
            value={formData.passouPorCirurgia}
            onChange={handleInputChange}
          />
        </div>

        {formData.passouPorCirurgia === 'sim' && (
          <div className="form-row conditional-field">
            <FormField
              type="textarea"
              label="Detalhes da Cirurgia"
              id="detalhesCirurgia"
              name="detalhesCirurgia"
              value={formData.detalhesCirurgia}
              onChange={handleInputChange}
              placeholder="Descreva a cirurgia realizada..."
              required
              fullWidth
            />
          </div>
        )}

        <div className="form-row">
          <RadioGroup
            label="Faz uso contínuo de algum medicamento?"
            name="usaMedicamentoContinuo"
            value={formData.usaMedicamentoContinuo}
            onChange={handleInputChange}
          />
        </div>

        {formData.usaMedicamentoContinuo === 'sim' && (
          <div className="form-row conditional-field">
            <FormField
              type="textarea"
              label="Detalhes do Medicamento"
              id="detalhesMedicamento"
              name="detalhesMedicamento"
              value={formData.detalhesMedicamento}
              onChange={handleInputChange}
              placeholder="Descreva o medicamento e posologia..."
              required
              fullWidth
            />
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
          />
        </div>
      </FormSection>

      {/* Botões */}
      <div className="btn-container">
        <button type="submit" className="submit-btn">
          <Save size={16} />
          {submitButtonText}
        </button>
        <button type="button" className="cancel-btn">
          <X size={16} />
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default StudentForm;