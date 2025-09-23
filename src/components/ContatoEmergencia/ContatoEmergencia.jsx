import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormField from '../FormField/FormField';
import './ContatoEmergencia.css';

const ContatoEmergencia = ({
  contatos,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <div>
      <div className="form-section-subtitle">
        <h3>Contatos de Emergência</h3>
      </div>
      
      {contatos.map((contato, index) => (
        <div key={index} className="contato-emergencia-group">
          <div className="form-row">
            <FormField
              label={`Nome do Contato ${index + 1}`}
              id={`contatoNome${index}`}
              value={contato.nome}
              onChange={(e) => onUpdate(index, 'nome', e.target.value)}
              placeholder="Nome completo"
              required
            />
            
            <FormField
              type="tel"
              label={`Telefone do Contato ${index + 1}`}
              id={`contatoTelefone${index}`}
              value={contato.telefone}
              onChange={(e) => onUpdate(index, 'telefone', e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
            
            {contatos.length > 1 && (
              <div className="form-group-remove">
                <button
                  type="button"
                  className="remove-contato-btn"
                  onClick={() => onRemove(index)}
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
          onClick={onAdd}
        >
          <Plus size={16} />
          Adicionar Contato de Emergência
        </button>
      </div>
    </div>
  );
};

export default ContatoEmergencia;