import React, { useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import './LoginPage.css';

const AUTH_KEY = process.env.REACT_APP_COMETCHAT_AUTH_KEY;

// ARCALINK: MVP — Mapeamento email → UID CometChat
// PRODUÇÃO: Substituir por chamada ao backend ArcaLink que retorna Auth Token
const MVP_USERS = {
  'dr.joao@clinica.com': { uid: 'cometchat-uid-1', password: 'senha123', nome: 'Dr. João Silva', role: 'Médico' },
  'maria.silva@email.com': { uid: 'cometchat-uid-2', password: 'senha123', nome: 'Maria Silva', role: 'Paciente' },
};

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Por favor, insira seu e-mail.'); return; }
    if (!isValidEmail(email.trim())) { setError('Por favor, insira um e-mail válido.'); return; }
    if (!password.trim()) { setError('Por favor, insira sua senha.'); return; }
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }

    setLoading(true);
    try {
      const emailLower = email.trim().toLowerCase();
      const user = MVP_USERS[emailLower];

      if (!user || user.password !== password) {
        setError('E-mail ou senha incorretos. Tente novamente.');
        setLoading(false);
        return;
      }

      // ARCALINK: Login na CometChat diretamente com UID + AuthKey (MVP)
      // PRODUÇÃO: Obter authToken do backend e usar CometChat.login(authToken)
      await CometChat.login(user.uid, AUTH_KEY);
      onLoginSuccess();
    } catch (err) {
      console.error('ArcaLink login error:', err);
      setError('Erro ao fazer login. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (userEmail) => {
    const u = MVP_USERS[userEmail];
    setEmail(userEmail);
    setPassword(u.password);
    setError('');
  };

  return (
    <div className="login-container">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="brand-section">
          <h1 className="brand-name">ArcaLink</h1>
          <p className="brand-tagline">Comunicação médica segura</p>
        </div>
        <div className="brand-features">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div>
              <strong>Privacidade Total</strong>
              <p>Médicos protegem seus dados pessoais</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <div>
              <strong>Grupos Privados</strong>
              <p>Comunicação exclusiva por convite</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚖️</span>
            <div>
              <strong>Conformidade LGPD</strong>
              <p>Dados protegidos por lei</p>
            </div>
          </div>
        </div>
        <p className="brand-version">v1.0.0-MVP · arcalink.com.br</p>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Entrar</h2>
            <p className="login-subtitle">Acesse sua conta ArcaLink</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="field-group">
              <label className="field-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Senha</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="field-input password-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-alert" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`login-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading ? <span className="btn-spinner"></span> : 'Entrar'}
            </button>

            <button
              type="button"
              className="forgot-btn"
              onClick={() => setError('Recuperação de senha disponível em breve.')}
            >
              Esqueci minha senha
            </button>
          </form>

          {/* Demo accounts */}
          <div className="demo-section">
            <p className="demo-title">Contas de demonstração (MVP):</p>
            <div className="demo-buttons">
              <button className="demo-btn medico" onClick={() => fillDemo('dr.joao@clinica.com')}>
                <span className="demo-role">Médico</span>
                <span className="demo-name">Dr. João Silva</span>
              </button>
              <button className="demo-btn paciente" onClick={() => fillDemo('maria.silva@email.com')}>
                <span className="demo-role">Paciente</span>
                <span className="demo-name">Maria Silva</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
