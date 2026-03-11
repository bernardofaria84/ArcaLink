# ArcaLink — PRD (Produto de Comunicação Médica Segura)

## Problema Original
Criar um aplicativo de comunicação segura para a área médica chamado ArcaLink, em conformidade com a LGPD. Baseado no CometChat UIKit com identidade visual própria, voltado para o mercado brasileiro.

## Arquitetura

```
/app
├── arcalink/               # Projeto React Native (modificado, não compilado/testado)
│   └── examples/SampleApp/ # Código-fonte do app nativo
├── backend/                # FastAPI mínimo (rota raiz apenas)
│   └── server.py
└── frontend/               # Web Preview React (em produção)
    ├── src/
    │   ├── App.js          # Inicialização CometChat UIKit, CometChatLocalize pt, logout
    │   ├── App.css         # TEMA WHATSAPP-STYLE: overrides CometChat (teal, bubbles)
    │   ├── i18n/ptBR.js    # Referência de traduções PT-BR (não usadas — locale 'pt' embutido)
    │   └── components/
    │       ├── ChatApp.js       # Lógica principal do chat
    │       ├── ChatApp.css      # Layout chat-view, header teal, back button
    │       ├── LoginPage.js     # Login MVP + updateCurrentUserDetails
    │       ├── LoginPage.css    # Estilos da tela de login
    │       └── PhoneMockup.js   # Mockup de iPhone
    └── public/
```

## Credenciais de Teste
- **Médico:** dr.joao@clinica.com / senha123 (UID: cometchat-uid-1)
- **Paciente:** maria.silva@email.com / senha123 (UID: cometchat-uid-2)
- **CometChat App ID:** 1676216c370017025
- **CometChat Region:** us

## Stack Técnico
- **Frontend Preview:** React 18, CometChat UIKit React v6.3.11
- **Backend:** FastAPI (mínimo)
- **App Nativo:** React Native 0.73, CometChat RN UIKit v5.2.11

## O que foi implementado

### ✅ FASE 1 — MVP Web Preview (sessão anterior)
- Login com email/senha + botões demo (Médico/Paciente)
- Mockup iPhone com abas: Conversas, Grupos, Perfil
- Integração CometChat Web SDK
- Controle por papel (médico/paciente): médico vê botão "+"
- Modal de criar grupo
- Edição de perfil + logout

### ✅ FASE 2 — Visual 100% WhatsApp (sessão atual, 2026-03-11)
- **CSS do CometChat UIKit importado corretamente** (`@cometchat/chat-uikit-react/css-variables.css`)
- **Login corrigido** para usar `CometChatUIKit.login()` (não `CometChat.login()`) — inicializa DataSource
- **Tema teal ArcaLink** via override de CSS variables:
  - `--cometchat-primary-color: #0A6E6E`
  - `--cometchat-extended-primary-color-500: #0A6E6E` (avatares)
- **Bubbles WhatsApp**: saída=teal, entrada=branco, fundo sandy #ECE5DD
- **Header teal** com CSS variable scoped (`--cometchat-background-color-01: transparent`)
- **Botão "←" de voltar** customizado (`chat-back-btn`)
- **PT-BR completo**: `CometChatLocalize.init({language: 'pt'})` → "Hoje", "Ontem", "Visto por último", "Digite sua mensagem aqui"
- **Compositor completo**: +, microfone, emoji, sticker, botão enviar teal
- **Logout corrigido**: setTimeout 150ms para evitar React error overlay
- **Nome de usuário atualizado**: `CometChat.updateCurrentUserDetails()` após login

### ✅ FASE 3 — Auto-scroll + Fix de Navegação (2026-03-11)
- **Auto-scroll corrigido (v2)**: Seletor `.cometchat-list__body` (elemento real scrollável do CometChat), 3 timeouts (50/300/800ms) + `requestAnimationFrame`, prop nativa `scrollToBottomOnNewMessages={true}`
- **Fix de navegação Grupos→Voltar**: `openChat()` recebe parâmetro `tab`; grupos preservam aba ao pressionar Voltar

### ✅ FASE 4 — Painel de Detalhes do Chat (2026-03-11)
- **DetailsPanel**: ao clicar no header do chat, painel desliza do topo com nome/status/UID (individual) ou nome/GUID/lista de membros com papel (grupo)
- **Solução stopPropagation**: botão transparente absolutamente posicionado (`.chat-header-overlay-btn`, z-index:5) captura click antes do CometChat UIKit bloquear propagação

### ✅ Testes (iteração 5) — 100% passando (7/7)
- Auto-scroll individual/grupo, painel detalhes click real (individual + grupo), conteúdo correto, fechar painel

## Known Issues (aceitáveis)
- Nome do contato mostra email até CometChat sincronizar (comportamento normal do SDK)
- Avatar "P-" em "Pre-Natal" (CometChat usa hífen como caractere de inicial)
- App React Native (`/app/arcalink`) nunca compilado/testado

## MOCKED
- **Login**: email→UID mapeado no frontend, sem validação real de senha por backend

## Backlog Priorizado

### P0 — Pré-lançamento
- [ ] Backend de autenticação real com JWT (substituir MVP_USERS)
- [ ] Compilar e testar app React Native em emulador/dispositivo real

### P1 — Próximas funcionalidades
- [ ] Notificações Push (FCM Android + APNs iOS)
- [ ] "Esqueci minha senha" com link de reset
- [ ] Fluxo "Encerrar Grupo de Consulta" funcional no web preview

### P2 — Melhorias
- [ ] Editar perfil com upload de foto (atualmente modal visual sem persistência)
- [ ] Indicador online/offline em tempo real na lista de conversas
- [ ] Busca de mensagens
