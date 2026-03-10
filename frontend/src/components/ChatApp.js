import React, { useEffect, useState } from 'react';
import {
  CometChatConversations,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatUIKit,
} from '@cometchat/chat-uikit-react';
import './ChatApp.css';

// ARCALINK: Role labels in pt-BR
const ROLE_LABELS = { medico: 'Médico', paciente: 'Paciente' };

// ARCALINK: Bottom Tab definitions
const TABS = [
  { id: 'chats',    label: 'Conversas', icon: '💬' },
  { id: 'groups',   label: 'Grupos',    icon: '👥' },
  { id: 'profile',  label: 'Perfil',    icon: '👤' },
];

function ChatApp({ onLogout }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [activeUser, setActiveUser] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [inChatView, setInChatView] = useState(false);

  useEffect(() => {
    CometChatUIKit.getLoggedinUser().then((u) => { if (u) setLoggedUser(u); });
  }, []);

  const isMedico = loggedUser?.getRole?.() === 'medico';
  const roleLabel = ROLE_LABELS[loggedUser?.getRole?.()] ?? loggedUser?.getRole?.() ?? '';
  const userName = loggedUser?.getName?.() ?? '';
  const initial = userName.charAt(0).toUpperCase() || 'U';

  const handleConversationClick = (conversation) => {
    const type = conversation.getConversationType();
    if (type === 'user') {
      setActiveUser(conversation.getConversationWith());
      setActiveGroup(null);
    } else {
      setActiveGroup(conversation.getConversationWith());
      setActiveUser(null);
    }
    setInChatView(true);
  };

  const handleBack = () => {
    setInChatView(false);
    setActiveUser(null);
    setActiveGroup(null);
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do ArcaLink?')) {
      onLogout();
    }
  };

  const hasActiveChat = activeUser || activeGroup;

  /* ── RENDER helpers ── */
  const renderChats = () => (
    <div className="tab-content">
      {/* In-chat view (messages) */}
      {inChatView && hasActiveChat ? (
        <div className="chat-view">
          {/* Header com voltar */}
          <div className="chat-view-header">
            <button className="back-arrow" onClick={handleBack}>←</button>
            <div className="chat-view-header-content">
              <CometChatMessageHeader
                user={activeUser || undefined}
                group={activeGroup || undefined}
              />
            </div>
          </div>
          <div className="chat-view-messages">
            <CometChatMessageList
              user={activeUser || undefined}
              group={activeGroup || undefined}
            />
          </div>
          <div className="chat-view-composer">
            <CometChatMessageComposer
              user={activeUser || undefined}
              group={activeGroup || undefined}
            />
          </div>
        </div>
      ) : (
        /* Conversations list */
        <div className="conversations-view">
          <div className="tab-header">
            <span className="tab-header-title">Conversas</span>
          </div>
          <div className="cometchat-list-wrap">
            <CometChatConversations onItemClick={handleConversationClick} />
          </div>
        </div>
      )}
    </div>
  );

  const renderGroups = () => (
    <div className="tab-content">
      <div className="tab-header">
        <span className="tab-header-title">Grupos</span>
        {isMedico && (
          <button className="tab-header-action" title="Novo Grupo Médico">+</button>
        )}
      </div>
      <div className="groups-placeholder">
        <div className="placeholder-icon">👥</div>
        <p className="placeholder-title">Seus grupos médicos</p>
        <p className="placeholder-sub">
          {isMedico
            ? 'Crie grupos privados para cada consulta tocando em "+"'
            : 'Você participará dos grupos em que for adicionado pelo médico'}
        </p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="tab-content profile-tab">
      {/* Profile header */}
      <div className="profile-header-bg">
        <div
          className="profile-avatar-big"
          style={{ background: isMedico ? '#2D9E6B' : '#1A4A7A' }}
        >
          {initial}
        </div>
        <p className="profile-name">{userName}</p>
        <span
          className="profile-role-chip"
          style={{
            background: isMedico ? 'rgba(45,158,107,0.15)' : 'rgba(26,74,122,0.15)',
            color: isMedico ? '#2D9E6B' : '#1A4A7A',
          }}
        >
          {roleLabel}
        </span>
      </div>

      {/* Info rows */}
      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-row-label">UID</span>
          <span className="profile-row-val">{loggedUser?.getUid?.()}</span>
        </div>
        <div className="profile-divider" />
        <div className="profile-row">
          <span className="profile-row-label">Tipo de Conta</span>
          <span className="profile-row-val" style={{ color: isMedico ? '#2D9E6B' : '#1A4A7A' }}>
            {roleLabel}
          </span>
        </div>
        {isMedico && (
          <>
            <div className="profile-divider" />
            <div className="profile-row">
              <span className="profile-row-label">CRM</span>
              <span className="profile-row-val">A preencher</span>
            </div>
          </>
        )}
        <div className="profile-divider" />
        <div className="profile-row">
          <span className="profile-row-label">Versão</span>
          <span className="profile-row-val">v1.0.0-MVP</span>
        </div>
      </div>

      <button className="edit-profile-btn">Editar Perfil</button>
      <button className="logout-btn-mobile" onClick={handleLogout}>Sair da conta</button>
      <p className="profile-legal">
        ArcaLink · arcalink.com.br · Conforme LGPD
      </p>
    </div>
  );

  return (
    <div className="mobile-chat-app">
      {/* Top navigation bar */}
      <div className="mobile-topbar">
        <div className="topbar-logo">ArcaLink</div>
        <div
          className="topbar-avatar"
          style={{ background: isMedico ? '#2D9E6B' : '#1A4A7A' }}
          onClick={() => setActiveTab('profile')}
        >
          {initial}
        </div>
      </div>

      {/* Content area */}
      <div className="mobile-content">
        {activeTab === 'chats'   && renderChats()}
        {activeTab === 'groups'  && renderGroups()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Bottom Tab Bar — hidden when in chat view */}
      {!inChatView && (
        <div className="mobile-tab-bar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatApp;
