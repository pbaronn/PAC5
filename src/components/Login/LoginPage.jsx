import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import './LoginPage.css';
// import lebreImage from '../../assets/images/lebre.png';
// import logoImage from '../../assets/images/brasao.png';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Dados do login:', { username, password });
    if (username === 'admin' && password === '123') {
      setMessageText('Login bem-sucedido!');
      setShowMessage(true);
      // Chama a função para navegar para a tela de busca após 2 segundos
      setTimeout(() => {
        onLoginSuccess();
      }, 2000);
    } else {
      setMessageText('Usuário ou senha inválidos.');
      setShowMessage(true);
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
            <button type="submit" className="login-button">Entrar</button>
          </form>
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
