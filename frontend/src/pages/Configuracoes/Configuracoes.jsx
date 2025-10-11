import React, { useState } from 'react';
import { Settings, User, Lock, Save, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../../components/Header/Header';
import ConfiguracoesSidebar from '../../components/ConfiguracoesSidebar/ConfiguracoesSidebar';
import './Configuracoes.css';

const Configuracoes = ({ onLogout, onNavigate }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    currentUsername: 'admin', // Valor mockado
    newUsername: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    password: true,
    username: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação da senha atual
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    // Validação da nova senha
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Validação do novo nome de usuário
    if (!formData.newUsername.trim()) {
      newErrors.newUsername = 'Novo nome de usuário é obrigatório';
    } else if (formData.newUsername.length < 3) {
      newErrors.newUsername = 'O nome de usuário deve ter pelo menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Simular alteração de senha
    console.log('Alterando senha:', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    setSuccessMessage('Senha alterada com sucesso!');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    
    if (!formData.newUsername.trim()) {
      setErrors({ newUsername: 'Novo nome de usuário é obrigatório' });
      return;
    }

    if (formData.newUsername.length < 3) {
      setErrors({ newUsername: 'O nome de usuário deve ter pelo menos 3 caracteres' });
      return;
    }

    // Simular alteração de nome de usuário
    console.log('Alterando nome de usuário:', {
      currentUsername: formData.currentUsername,
      newUsername: formData.newUsername
    });

    setSuccessMessage('Nome de usuário alterado com sucesso!');
    setFormData(prev => ({
      ...prev,
      currentUsername: formData.newUsername,
      newUsername: ''
    }));

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleSidebarClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('gerenciar');
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="student-search-container">
      <Header 
        activeNav="Configurações" 
        onLogout={onLogout} 
        onNavigate={onNavigate}
      />
      
      <div className="main-content">
        <ConfiguracoesSidebar 
          activeItem="Configurações" 
          onItemClick={handleSidebarClick}
          onBack={handleBack}
        />
        
        <main className="main-panel">
          <h1 className="panel-title">Configurações</h1>

          {successMessage && (
            <div className="success-message">
              <Save size={20} />
              <span>{successMessage}</span>
            </div>
          )}
          
          <div className="config-sections">
            {/* Seção de alteração de senha */}
            <div className="config-section">
              <div 
                className="section-header clickable"
                onClick={() => toggleSection('password')}
              >
                <div className="section-title">
                  <Lock size={24} />
                  <h2>Alterar Senha</h2>
                </div>
                {collapsedSections.password ? (
                  <ChevronDown size={24} />
                ) : (
                  <ChevronUp size={24} />
                )}
              </div>
              
              {!collapsedSections.password && (
                <form onSubmit={handlePasswordChange} className="config-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Senha Atual</label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <span className="error-message">{errors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nova Senha</label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.newPassword ? 'error' : ''}`}
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirme sua nova senha"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <button type="submit" className="save-button">
                  <Save size={20} />
                  <span>Alterar Senha</span>
                </button>
                </form>
              )}
            </div>

            {/* Seção de alteração de nome de usuário */}
            <div className="config-section">
              <div 
                className="section-header clickable"
                onClick={() => toggleSection('username')}
              >
                <div className="section-title">
                  <User size={24} />
                  <h2>Alterar Nome de Usuário</h2>
                </div>
                {collapsedSections.username ? (
                  <ChevronDown size={24} />
                ) : (
                  <ChevronUp size={24} />
                )}
              </div>
              
              {!collapsedSections.username && (
                <form onSubmit={handleUsernameChange} className="config-form">
                <div className="form-group">
                  <label htmlFor="currentUsername">Nome de Usuário Atual</label>
                  <input
                    type="text"
                    id="currentUsername"
                    name="currentUsername"
                    value={formData.currentUsername}
                    className="form-input"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newUsername">Novo Nome de Usuário</label>
                  <input
                    type="text"
                    id="newUsername"
                    name="newUsername"
                    value={formData.newUsername}
                    onChange={handleInputChange}
                    className={`form-input ${errors.newUsername ? 'error' : ''}`}
                    placeholder="Digite o novo nome de usuário"
                  />
                  {errors.newUsername && (
                    <span className="error-message">{errors.newUsername}</span>
                  )}
                </div>

                <button type="submit" className="save-button">
                  <Save size={20} />
                  <span>Alterar Nome de Usuário</span>
                </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Configuracoes;
