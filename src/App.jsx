
import './App.css'
import { useState } from 'react'
import LoginPage from './components/Login/LoginPage'
import BuscaAluno from './components/Aluno/BuscaAluno'
import CadastrarAlunos from './components/aluno/CadastraAluno'
import EditaAluno from './components/Aluno/EditaAluno'

function App() {
  const [currentPage, setCurrentPage] = useState('login') 

  const handleLoginSuccess = () => {
    setCurrentPage('busca')
  }

  const handleLogout = () => {
    setCurrentPage('login')
  }

  const handleNavigateToCadastro = () => {
    setCurrentPage('cadastro')
  }

  const handleNavigateToBusca = () => {
    setCurrentPage('busca')
  }

   const handleNavigateEdita = () => {
    setCurrentPage('edita')
  }


  return (
    <div className="App">
      {/* Botões de teste para alternar entre telas */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setCurrentPage('login')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: currentPage === 'login' ? '#4d0402' : '#666',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <button 
          onClick={() => setCurrentPage('busca')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: currentPage === 'busca' ? '#4d0402' : '#666',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Busca
        </button>
        <button 
          onClick={() => setCurrentPage('cadastro')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: currentPage === 'cadastro' ? '#4d0402' : '#666',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cadastro
        </button>

        <button 
          onClick={() => setCurrentPage('edita')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: currentPage === 'edita' ? '#4d0402' : '#666',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edita
        </button>

      </div>

      {currentPage === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === 'busca' && (
        <BuscaAluno onLogout={handleLogout} />
      )}
      {currentPage === 'cadastro' && (
        <CadastrarAlunos onLogout={handleLogout} />
      )}

       {currentPage === 'edita' && (
        <EditaAluno onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
