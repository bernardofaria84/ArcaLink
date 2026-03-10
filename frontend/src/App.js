import React, { useEffect, useState } from 'react';
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react';
import LoginPage from './components/LoginPage';
import ChatApp from './components/ChatApp';
import './App.css';

const APP_ID = process.env.REACT_APP_COMETCHAT_APP_ID;
const AUTH_KEY = process.env.REACT_APP_COMETCHAT_AUTH_KEY;
const REGION = process.env.REACT_APP_COMETCHAT_REGION;

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initError, setInitError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const UIKitSettings = new UIKitSettingsBuilder()
      .setAppId(APP_ID)
      .setRegion(REGION)
      .setAuthKey(AUTH_KEY)
      .subscribePresenceForAllUsers()
      .build();

    CometChatUIKit.init(UIKitSettings)
      .then(() => {
        setIsInitialized(true);
        // Verificar se já tem usuário logado
        return CometChatUIKit.getLoggedinUser();
      })
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('ArcaLink: Erro ao inicializar CometChat:', err);
        setInitError('Erro ao conectar com o servidor. Verifique as credenciais.');
        setLoading(false);
      });
  }, []);

  const handleLoginSuccess = () => {
    // Refresh logged user after login
    CometChatUIKit.getLoggedinUser().then((u) => {
      if (u) console.log('ArcaLink: Logged in as', u.getName(), 'role:', u.getRole());
    });
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await CometChatUIKit.logout();
      setIsLoggedIn(false);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">ArcaLink</div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Comunicação médica segura</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="error-screen">
        <div className="error-logo">ArcaLink</div>
        <div className="error-box">
          <p>{initError}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <ChatApp onLogout={handleLogout} />;
}

export default App;
