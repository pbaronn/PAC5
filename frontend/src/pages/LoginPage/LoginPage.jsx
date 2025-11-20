import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { authService } from '../../services/api';
import './LoginPage.css';
// import lebreImage from '../../assets/images/lebre.png';
// import logoImage from '../../assets/images/brasao.png';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessageText('');
    setMessageType('');
    
    try {
      console.log('Dados do login:', { username, password });
      
      const response = await authService.login({ username, password });
      
      console.log('Login realizado com sucesso:', response);
      setMessageText('Login bem-sucedido!');
      setMessageType('success');
      
      // Chama a função para navegar para a tela de busca após 1.5 segundos
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
      
    } catch (error) {
      console.error('Erro no login:', error);
      setMessageText(error.message || 'Usuário ou senha inválidos.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Seção Esquerda - Fundo Preto com Mascote */}
      <div className="left-section">
        <div className="mascot-container">
          <img 
            src="/img/lebre.png" 
            alt="Lebre" 
            className="rabbit-mascot" 
          />
        </div>
      </div>

      {/* Seção Direita - Fundo Preto com Formulário */}
      <div className="right-section">
        <div className="login-form-container">
          <div className="logo-container">
            <img 
              src="/img/brasao.png" 
              alt="Logo JEC" 
              className="logo" 
            />
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <User size={20} className="icon" />
              <input
                type="text"
                placeholder="Usuário:"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <Lock size={20} className="icon" />
              <input
                type="password"
                placeholder="Senha:"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            {messageText && (
              <div className={`message-text ${messageType}`}>
                {messageText}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
