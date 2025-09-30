import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setMessageText('Por favor, preencha usuário e senha.');
      setShowMessage(true);
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        setMessageText('Login realizado com sucesso!');
        setShowMessage(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      } else {
        setMessageText(result.error || 'Erro ao fazer login');
        setShowMessage(true);
      }
    } catch (error) {
      setMessageText('Erro de conexão. Verifique se o servidor está rodando.');
      setShowMessage(true);
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="login-info">
            <small>Usuário padrão: admin | Senha: 123</small>
          </div>
        </div>
      </div>
      
      {showMessage && (
        <div className="message-box" onAnimationEnd={() => setShowMessage(false)}>
          {messageText}
        </div>
      )}
    </div>
  );
};

export default LoginPage;