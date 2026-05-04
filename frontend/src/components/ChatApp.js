import React, { useEffect, useState, useCallback } from 'react';
import {
  CometChatConversations,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatUIKit,
  CometChatGroups,
} from '@cometchat/chat-uikit-react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import './ChatApp.css';

const ROLE_LABELS = { medico: 'Médico', paciente: 'Paciente' };
const TABS = [
  { id: 'chats',   label: 'Conversas', icon: '💬' },
  { id: 'groups',  label: 'Grupos',    icon: '👥' },
  { id: 'profile', label: 'Perfil',    icon: '👤' },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Modal de Nova Conversa
   Permite ao médico buscar um usuário e iniciar
   uma conversa direta
───────────────────────────────────────────── */
function NewChatModal({ onClose, onUserSelected }) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carrega todos os usuários ao abrir
  useEffect(() => {
    fetchUsers('');
  }, []);

  const fetchUsers = async (q) => {
    setLoading(true);
    try {
      const me = await CometChatUIKit.getLoggedinUser();
      const req = new CometChat.UsersRequestBuilder()
        .setLimit(50)
        .setSearchKeyword(q.trim())
        .build();
      const result = await req.fetchNext();
      // Filtrar usuário logado da lista
      setUsers(result.filter((u) => u.getUid() !== me?.getUid()));
    } catch (e) {
      console.error('ArcaLink: erro ao buscar usuários', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchUsers(val);
  };

  const roleOf = (u) => ROLE_LABELS[u.getRole()] ?? u.getRole() ?? '';
  const colorOf = (u) => u.getRole() === 'medico' ? '#2D9E6B' : '#1A4A7A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="modal-handle" />

        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">Nova Conversa</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <div className="modal-search-wrap">
          <input
            className="modal-search-input"
            type="text"
            placeholder="Buscar por nome..."
            value={query}
            onChange={handleSearch}
            autoFocus
          />
        </div>

        {/* User list */}
        <div className="modal-list">
          {loading && <p className="modal-loading">Buscando...</p>}
          {!loading && users.length === 0 && (
            <p className="modal-empty">Nenhum usuário encontrado.</p>
          )}
          {users.map((u) => (
            <button
              key={u.getUid()}
              className="modal-user-row"
              onClick={() => onUserSelected(u)}
            >
              <div
                className="modal-avatar"
                style={{ background: colorOf(u) }}
              >
                {u.getName().charAt(0).toUpperCase()}
              </div>
              <div className="modal-user-info">
                <span className="modal-user-name">{u.getName()}</span>
                <span className="modal-user-role" style={{ color: colorOf(u) }}>
                  {roleOf(u)}
                </span>
              </div>
              <span
                className={`modal-status-dot ${u.getStatus() === 'online' ? 'online' : 'offline'}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Modal Criar Grupo Médico
   Grupos são SEMPRE do tipo PRIVATE no ArcaLink
───────────────────────────────────────────── */
function CriarGrupoModal({ onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState('Consulta — ');
  const [patientQuery, setPatientQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const searchPatients = async (q) => {
    if (q.trim().length < 1) { setPatients([]); return; }
    setSearchLoading(true);
    try {
      const req = new CometChat.UsersRequestBuilder()
        .setLimit(20)
        .setSearchKeyword(q.trim())
        .build();
      const result = await req.fetchNext();
      // ARCALINK: mostrar todos os usuários (pacientes + outros médicos)
      setPatients(result);
    } catch (e) {
      console.error('ArcaLink: erro ao buscar pacientes', e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectPatient = (u) => {
    setSelectedPatient(u);
    setPatientQuery(u.getName());
    setPatients([]);
    // Sugestão automática de nome do grupo
    if (groupName === 'Consulta — ' || groupName.startsWith('Consulta — ')) {
      setGroupName(`Consulta — ${u.getName()}`);
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim()) { setError('Informe o nome do grupo.'); return; }
    setError('');
    setCreating(true);
    try {
      // ARCALINK: grupos são SEMPRE PRIVATE
      const GUID = `arcalink_${Date.now()}`;
      const group = new CometChat.Group(
        GUID,
        groupName.trim(),
        CometChat.GROUP_TYPE.PRIVATE,
        ''
      );
      const created = await CometChat.createGroup(group);

      // Adicionar paciente selecionado como PARTICIPANT
      if (selectedPatient) {
        const member = new CometChat.GroupMember(
          selectedPatient.getUid(),
          CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT
        );
        await CometChat.addMembersToGroup(created.getGuid(), [member], []);
      }

      onGroupCreated(created);
    } catch (e) {
      console.error('ArcaLink: erro ao criar grupo', e);
      setError('Erro ao criar grupo. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const roleOf = (u) => ROLE_LABELS[u.getRole()] ?? u.getRole() ?? '';
  const colorOf = (u) => u.getRole() === 'medico' ? '#2D9E6B' : '#1A4A7A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-title">Novo Grupo Médico</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Private badge */}
        <div className="modal-private-badge">
          🔒 Grupo Privado — somente convidados
        </div>

        {/* Group name */}
        <div className="modal-field">
          <label className="modal-field-label">Nome do Grupo *</label>
          <input
            className="modal-field-input"
            type="text"
            value={groupName}
            onChange={(e) => { setGroupName(e.target.value); setError(''); }}
            placeholder="Ex: Consulta — Nome do Paciente"
          />
        </div>

        {/* Patient search */}
        <div className="modal-field" style={{ position: 'relative' }}>
          <label className="modal-field-label">Adicionar Participante</label>
          <div className="modal-search-wrap">
            <input
              className="modal-search-input"
              type="text"
              placeholder="Buscar por nome..."
              value={patientQuery}
              onChange={(e) => {
                setPatientQuery(e.target.value);
                setSelectedPatient(null);
                searchPatients(e.target.value);
              }}
            />
            {selectedPatient && (
              <button
                className="modal-clear-patient"
                onClick={() => { setSelectedPatient(null); setPatientQuery(''); setPatients([]); }}
              >✕</button>
            )}
          </div>

          {/* Dropdown de resultados */}
          {patients.length > 0 && (
            <div className="modal-dropdown">
              {searchLoading && <p className="modal-loading">Buscando...</p>}
              {patients.map((u) => (
                <button
                  key={u.getUid()}
                  className="modal-user-row compact"
                  onClick={() => handleSelectPatient(u)}
                >
                  <div className="modal-avatar small" style={{ background: colorOf(u) }}>
                    {u.getName().charAt(0).toUpperCase()}
                  </div>
                  <div className="modal-user-info">
                    <span className="modal-user-name">{u.getName()}</span>
                    <span className="modal-user-role" style={{ color: colorOf(u) }}>
                      {roleOf(u)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Participante selecionado */}
          {selectedPatient && (
            <div className="modal-selected-patient">
              <div className="modal-avatar small" style={{ background: colorOf(selectedPatient) }}>
                {selectedPatient.getName().charAt(0).toUpperCase()}
              </div>
              <span>{selectedPatient.getName()} selecionado(a)</span>
            </div>
          )}
        </div>

        {error && <p className="modal-error">{error}</p>}

        <button
          className={`modal-create-btn${creating ? ' loading' : ''}`}
          onClick={handleCreate}
          disabled={creating}
        >
          {creating ? <span className="btn-spin-dark" /> : 'Criar Grupo'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Modal Confirmação de Logout
   Substitui window.confirm() — bloqueado em iframes
───────────────────────────────────────────── */
function LogoutConfirmModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-sheet confirm-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="confirm-icon">👋</div>
        <h3 className="confirm-title">Sair da conta?</h3>
        <p className="confirm-msg">Tem certeza que deseja sair do ArcaLink?</p>
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>Cancelar</button>
          <button className="confirm-btn danger" onClick={onConfirm}>Sair</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Modal Editar Perfil
   Permite alterar o nome de exibição do usuário
───────────────────────────────────────────── */
function EditProfileModal({ currentUser, onClose, onSaved }) {
  const [name, setName] = useState(currentUser?.getName?.() ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setError('O nome não pode estar vazio.'); return; }
    setSaving(true);
    setError('');
    try {
      // ARCALINK: Atualizar nome do usuário na CometChat
      const updatedUser = new CometChat.User(currentUser.getUid());
      updatedUser.setName(name.trim());
      const saved = await CometChat.updateCurrentUserDetails(updatedUser);
      setSuccess(true);
      setTimeout(() => { onSaved(saved); onClose(); }, 900);
    } catch (e) {
      console.error('ArcaLink: erro ao atualizar perfil', e);
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <span className="modal-title">Editar Perfil</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="edit-profile-body">
          {/* Avatar preview */}
          <div className="edit-avatar-preview">
            {name.charAt(0).toUpperCase() || '?'}
          </div>

          <div className="modal-field">
            <label className="modal-field-label">Nome de exibição</label>
            <input
              className="modal-field-input"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); setSuccess(false); }}
              placeholder="Seu nome completo"
              autoFocus
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          {success && (
            <p className="modal-success">✓ Perfil atualizado com sucesso!</p>
          )}

          <button
            className={`modal-create-btn${saving ? ' loading' : ''}`}
            onClick={handleSave}
            disabled={saving || success}
          >
            {saving   ? <span className="btn-spin-dark" /> :
             success  ? '✓ Salvo!' :
             'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT: ChatApp
───────────────────────────────────────────── */
function ChatApp({ onLogout }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [activeUser, setActiveUser] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [inChatView, setInChatView] = useState(false);

  // Modals
  const [showNewChat, setShowNewChat] = useState(false);
  const [showCriarGrupo, setShowCriarGrupo] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    CometChatUIKit.getLoggedinUser().then((u) => { if (u) setLoggedUser(u); });
  }, []);

  const isMedico = loggedUser?.getRole?.() === 'medico';
  const roleLabel = ROLE_LABELS[loggedUser?.getRole?.()] ?? '';
  const userName = loggedUser?.getName?.() ?? '';
  const initial = userName.charAt(0).toUpperCase() || 'U';

  // ── Navigation handlers ──
  const openChat = useCallback((user, group) => {
    setActiveUser(user || null);
    setActiveGroup(group || null);
    setInChatView(true);
    setActiveTab('chats');
  }, []);

  const handleConversationClick = (conversation) => {
    const type = conversation.getConversationType();
    openChat(
      type === 'user'  ? conversation.getConversationWith() : null,
      type === 'group' ? conversation.getConversationWith() : null,
    );
  };

  const handleGroupItemClick = (group) => {
    openChat(null, group);
  };

  const handleBack = () => {
    setInChatView(false);
    setActiveUser(null);
    setActiveGroup(null);
  };

  const handleLogout = () => {
    // ARCALINK: usar modal customizado em vez de window.confirm() (bloqueado em iframes)
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirmed = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  // ── Modal handlers ──
  const handleUserSelected = (user) => {
    setShowNewChat(false);
    openChat(user, null);
  };

  const handleGroupCreated = (group) => {
    setShowCriarGrupo(false);
    // Navegar direto para o grupo criado
    openChat(null, group);
  };

  const hasActiveChat = activeUser || activeGroup;

  /* ── RENDER: Conversas ── */
  const renderChats = () => (
    <div className="tab-content">
      {inChatView && hasActiveChat ? (
        // Tela de mensagens
        <div className="chat-view">
          <div className="chat-view-header">
            {/* Botão de voltar customizado — CometChat UIKit não renderiza o back button por padrão */}
            <button className="chat-back-btn" onClick={handleBack} data-testid="chat-back-btn">
              ←
            </button>
            <CometChatMessageHeader
              user={activeUser || undefined}
              group={activeGroup || undefined}
              onBack={handleBack}
            />
          </div>
          <div className="chat-view-messages">
            <CometChatMessageList
              user={activeUser || undefined}
              group={activeGroup || undefined}
              scrollToBottomOnNewMessages={true}
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
        // Lista de conversas
        <div className="conversations-view">
          <div className="tab-header">
            <span className="tab-header-title">Conversas</span>
            {/* ARCALINK: Médico pode iniciar nova conversa */}
            {isMedico && (
              <button
                className="tab-header-action"
                title="Nova Conversa"
                onClick={() => setShowNewChat(true)}
              >
                +
              </button>
            )}
          </div>
          <div className="cometchat-list-wrap">
            <CometChatConversations onItemClick={handleConversationClick} />
          </div>
        </div>
      )}
    </div>
  );

  /* ── RENDER: Grupos ── */
  const renderGroups = () => (
    <div className="tab-content">
      {inChatView && hasActiveChat ? (
        // Tela de mensagens de grupo (quando vem de Grupos)
        <div className="chat-view">
          <div className="chat-view-header">
            {/* Botão de voltar customizado */}
            <button className="chat-back-btn" onClick={handleBack} data-testid="chat-back-btn-groups">
              ←
            </button>
            <CometChatMessageHeader
              group={activeGroup || undefined}
              onBack={handleBack}
            />
          </div>
          <div className="chat-view-messages">
            <CometChatMessageList
              group={activeGroup || undefined}
              scrollToBottomOnNewMessages={true}
            />
          </div>
          <div className="chat-view-composer">
            <CometChatMessageComposer group={activeGroup || undefined} />
          </div>
        </div>
      ) : (
        <div className="conversations-view">
          <div className="tab-header">
            <span className="tab-header-title">Grupos</span>
            {/* ARCALINK: Apenas médicos criam grupos */}
            {isMedico && (
              <button
                className="tab-header-action"
                title="Novo Grupo Médico"
                onClick={() => setShowCriarGrupo(true)}
              >
                +
              </button>
            )}
          </div>
          <div className="cometchat-list-wrap">
            <CometChatGroups onItemClick={handleGroupItemClick} />
          </div>
        </div>
      )}
    </div>
  );

  /* ── RENDER: Perfil ── */
  const renderProfile = () => (
    <div className="tab-content profile-tab">
      <div className="profile-header-bg">
        <div className="profile-avatar-big" style={{ background: isMedico ? '#2D9E6B' : '#1A4A7A' }}>
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
      <button className="edit-profile-btn" onClick={() => setShowEditProfile(true)}>
        Editar Perfil
      </button>
      <button className="logout-btn-mobile" onClick={handleLogout}>
        Sair da conta
      </button>
      <p className="profile-legal">ArcaLink · arcalink.com.br · Conforme LGPD</p>
    </div>
  );

  return (
    <div className="mobile-chat-app">
      {/* Top bar */}
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

      {/* Content */}
      <div className="mobile-content">
        {activeTab === 'chats'   && renderChats()}
        {activeTab === 'groups'  && renderGroups()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Bottom tab bar */}
      {!inChatView && (
        <div className="mobile-tab-bar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setInChatView(false); }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onUserSelected={handleUserSelected}
        />
      )}
      {showCriarGrupo && (
        <CriarGrupoModal
          onClose={() => setShowCriarGrupo(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
      {showLogoutConfirm && (
        <LogoutConfirmModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogoutConfirmed}
        />
      )}
      {showEditProfile && (
        <EditProfileModal
          currentUser={loggedUser}
          onClose={() => setShowEditProfile(false)}
          onSaved={(updatedUser) => setLoggedUser(updatedUser)}
        />
      )}
    </div>
  );
}

export default ChatApp;
