import React, { useEffect, useState } from 'react';
import {
  CometChatConversations,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatUIKit,
} from '@cometchat/chat-uikit-react';
import './ChatApp.css';

function ChatApp({ onLogout }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    CometChatUIKit.getLoggedinUser().then((u) => { if (u) setLoggedUser(u); });
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const roleLabel = loggedUser?.getRole?.() === 'medico' ? 'Médico' : 'Paciente';
  const isMedico = loggedUser?.getRole?.() === 'medico';

  const handleConversationClick = (conversation) => {
    const type = conversation.getConversationType();
    if (type === 'user') {
      setActiveUser(conversation.getConversationWith());
      setActiveGroup(null);
    } else {
      setActiveGroup(conversation.getConversationWith());
      setActiveUser(null);
    }
    if (isMobile) setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setActiveUser(null);
    setActiveGroup(null);
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do ArcaLink?')) {
      onLogout();
    }
  };

  const hasActiveChat = activeUser || activeGroup;

  return (
    <div className="chat-app">
      {/* Top Header */}
      <div className="app-header">
        <div className="app-logo">
          <span className="logo-text">ArcaLink</span>
          <span className="logo-tag">Comunicação médica segura</span>
        </div>
        <div className="header-actions">
          <div className="user-info" onClick={() => setShowProfile(!showProfile)}>
            <div
              className="user-avatar"
              style={{ backgroundColor: isMedico ? '#2D9E6B' : '#1A4A7A' }}
            >
              {loggedUser?.getName?.()?.charAt(0) ?? 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{loggedUser?.getName?.() ?? 'Usuário'}</span>
              <span
                className="user-role-badge"
                style={{ color: isMedico ? '#B2F0D5' : '#B2C8F0' }}
              >
                {roleLabel}
              </span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sair">
            ⏻
          </button>
        </div>
      </div>

      {/* Profile Dropdown Overlay */}
      {showProfile && (
        <div className="profile-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-card" onClick={(e) => e.stopPropagation()}>
            <div
              className="profile-big-avatar"
              style={{ backgroundColor: isMedico ? '#2D9E6B' : '#1A4A7A' }}
            >
              {loggedUser?.getName?.()?.charAt(0) ?? 'U'}
            </div>
            <p className="profile-name">{loggedUser?.getName?.()}</p>
            <span
              className="profile-role-chip"
              style={{
                backgroundColor: isMedico ? '#E8F7F1' : '#E8EFF7',
                color: isMedico ? '#2D9E6B' : '#1A4A7A',
              }}
            >
              {roleLabel}
            </span>
            <p className="profile-id">ID: {loggedUser?.getUid?.()}</p>
            {isMedico && <p className="profile-crm">CRM: A preencher</p>}
            <button className="profile-logout-btn" onClick={handleLogout}>
              Sair da conta
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="chat-layout">
        {/* Left: Conversations list */}
        <div
          className={`conversations-panel${isMobile && showChat ? ' hidden' : ''}`}
        >
          <CometChatConversations
            onItemClick={handleConversationClick}
          />
        </div>

        {/* Right: Message area */}
        <div
          className={`messages-panel${isMobile && !showChat ? ' hidden' : ''}`}
        >
          {hasActiveChat ? (
            <div className="messages-wrapper">
              <div className="message-header-wrapper">
                {isMobile && (
                  <button className="back-btn" onClick={handleBackToList}>
                    ← Voltar
                  </button>
                )}
                <CometChatMessageHeader
                  user={activeUser || undefined}
                  group={activeGroup || undefined}
                />
              </div>
              <div className="message-list-wrapper">
                <CometChatMessageList
                  user={activeUser || undefined}
                  group={activeGroup || undefined}
                />
              </div>
              <div className="message-composer-wrapper">
                <CometChatMessageComposer
                  user={activeUser || undefined}
                  group={activeGroup || undefined}
                />
              </div>
            </div>
          ) : (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <h3 className="empty-title">Selecione uma conversa</h3>
              <p className="empty-subtitle">
                Escolha uma conversa na lista à esquerda para começar a
                trocar mensagens.
              </p>
              {isMedico && (
                <p className="empty-hint">
                  Dica: Acesse Grupos para criar uma nova consulta médica.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
