import React, { useEffect, useState } from 'react';
import { CometChatUIKit, UIKitSettingsBuilder, CometChatLocalize } from '@cometchat/chat-uikit-react';
// Importa CSS do CometChat ANTES dos nossos estilos para garantir que nossos overrides vençam
import '@cometchat/chat-uikit-react/css-variables.css';
import LoginPage from './components/LoginPage';
import ChatApp from './components/ChatApp';
import PhoneMockup from './components/PhoneMockup';
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
        // Usa o locale PT embutido no CometChat UIKit (já tem "Hoje", "Ontem", etc.)
        CometChatLocalize.init({ language: 'pt' });
        setIsInitialized(true);
        return CometChatUIKit.getLoggedinUser();
      })
      .then((user) => {
        if (user) setIsLoggedIn(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ArcaLink: Erro ao inicializar CometChat:', err);
        setInitError('Erro ao conectar com o servidor.');
        setLoading(false);
      });
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = async () => {
    try {
      await CometChatUIKit.logout();
    } catch (_) {}
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="splash-screen">
          <div className="splash-logo">ArcaLink</div>
          <div className="splash-spinner" />
          <p className="splash-tagline">Comunicação médica segura</p>
        </div>
      );
    }
    if (initError) {
      return (
        <div className="splash-screen">
          <div className="splash-logo">ArcaLink</div>
          <div className="splash-error">{initError}</div>
        </div>
      );
    }
    if (!isLoggedIn) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    return <ChatApp onLogout={handleLogout} />;
  };

  return (
    <PhoneMockup>
      {renderContent()}
    </PhoneMockup>
  );
}

export default App;
