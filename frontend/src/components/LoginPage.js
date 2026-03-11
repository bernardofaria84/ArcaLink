import React, { useState } from 'react';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import './LoginPage.css';

const MVP_USERS = {
  'dr.joao@clinica.com':     { uid: 'cometchat-uid-1', password: 'senha123', nome: 'Dr. João Silva', role: 'Médico' },
  'maria.silva@email.com':   { uid: 'cometchat-uid-2', password: 'senha123', nome: 'Maria Silva',    role: 'Paciente' },
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
    if (!email.trim())           { setError('Insira seu e-mail.'); return; }
    if (!isValidEmail(email))    { setError('E-mail inválido.'); return; }
    if (!password.trim())        { setError('Insira sua senha.'); return; }
    if (password.length < 6)     { setError('Senha com mínimo 6 caracteres.'); return; }

    setLoading(true);
    try {
      const emailLower = email.trim().toLowerCase();
      const user = MVP_USERS[emailLower];
      if (!user || user.password !== password) {
        setError('E-mail ou senha incorretos.');
        return;
      }
      // ARCALINK: MVP login — usa CometChatUIKit.login() para inicializar o DataSource corretamente
      await CometChatUIKit.login(user.uid);
      onLoginSuccess();
    } catch (err) {
      console.error('ArcaLink login error:', err);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (userEmail) => {
    setEmail(userEmail);
    setPassword(MVP_USERS[userEmail].password);
    setError('');
  };

  return (
    <div className="login-mobile">
      {/* Header */}
      <div className="login-mobile-header">
        <div className="login-brand-name">ArcaLink</div>
        <div className="login-brand-tag">Comunicação médica segura</div>
      </div>

      {/* Form card */}
      <div className="login-mobile-card">
        <h2 className="login-mobile-title">Entrar</h2>
        <p className="login-mobile-subtitle">Acesse sua conta</p>

        <form onSubmit={handleLogin} className="login-mobile-form">
          {/* Email */}
          <div className="mobile-field">
            <label className="mobile-label">E-mail</label>
            <input
              type="email"
              className="mobile-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Senha */}
          <div className="mobile-field">
            <label className="mobile-label">Senha</label>
            <div className="mobile-pass-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="mobile-input pass-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="mobile-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error && <div className="mobile-error">{error}</div>}

          <button
            type="submit"
            className={`mobile-btn-primary${loading ? ' loading' : ''}`}
            disabled={loading}
          >
            {loading
              ? <span className="btn-spin" />
              : 'Entrar'
            }
          </button>

          <button
            type="button"
            className="mobile-forgot"
            onClick={() => setError('Recuperação de senha disponível em breve.')}
          >
            Esqueci minha senha
          </button>
        </form>
      </div>

      {/* Demo accounts */}
      <div className="login-demo">
        <p className="demo-label">Contas de demonstração:</p>
        <div className="demo-row">
          <button
            className="demo-chip medico"
            onClick={() => fillDemo('dr.joao@clinica.com')}
          >
            <span className="chip-role">Médico</span>
            <span className="chip-name">Dr. João Silva</span>
          </button>
          <button
            className="demo-chip paciente"
            onClick={() => fillDemo('maria.silva@email.com')}
          >
            <span className="chip-role">Paciente</span>
            <span className="chip-name">Maria Silva</span>
          </button>
        </div>
      </div>

      <div className="login-version">v1.0.0-MVP</div>
    </div>
  );
}

export default LoginPage;
