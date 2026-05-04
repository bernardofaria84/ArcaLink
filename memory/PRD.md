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

### ✅ FASE 3 — Auto-scroll WhatsApp-style (2026-05-04)
- **Problema**: lista de mensagens não fazia scroll para a última, e o wrapper `.cometchat` interno crescia além dos limites do container (1418px num espaço de 504px).
- **Fix 1 (`ChatApp.js`)**: prop `scrollToBottomOnNewMessages={true}` em ambos `<CometChatMessageList>` (chat individual + grupo).
- **Fix 2 (`ChatApp.css`)**: overrides forçando `flex: 1 1 0`, `min-height: 0`, `max-height: 100%` em todo o chain de wrappers (`.chat-view-messages > .cometchat`, `.cometchat-message-list`, `.cometchat-message-list__body`, `.cometchat-list`, `.cometchat-list__body`). O body interno mantém `overflow-y: auto`.
- **Validado**: container constrito a 504px com scroll interno; após 10 mensagens novas, scrollHeight=2146px, scrollTop=1642px, atBottom=True.

### ✅ FASE 4 — Recibos azuis + Typing destacado + Tema RN sincronizado (2026-05-04)
**Web Preview**:
- Recibo "lida" azul WhatsApp via override `:root { --cometchat-message-seen-color: #53BDEB; }`
- Selector correto identificado: `.cometchat-message-bubble__status-info-view-receipts-read .cometchat-message-list__receipt` (CometChat web usa CSS masks SVG, não classes `--read`).
- Typing indicator no header destacado: `#B2EFEF` itálico bold em `.cometchat-message-header__subtitle-typing`.
- Validado em runtime: `seenColorVar='#53BDEB'`, recibo lida = `rgb(83,189,235)`, recibo enviada = branco translúcido.

**React Native (`/app/arcalink/examples/SampleApp/App.tsx`)**:
- Tema WhatsApp aplicado via `arcaWhatsAppOverride` em `messageListStyles` + `messageHeaderStyles` + `receiptStyles`:
  - Fundo areia `#ECE5DD`, balão saída teal `#0A6E6E`, balão entrada branco
  - Header teal `#0A6E6E` com texto branco; typing italic `#B2EFEF`
  - `receiptStyles.readIconStyle.tintColor = '#53BDEB'` (azul WhatsApp)
- Spread em ambos `light` e `dark` do `CometChatThemeProvider`.
- Já existentes (sessão anterior): `CometChatUIKit.login`, `CometChatI18nProvider language="pt"` com pt-BR (166 chaves), config.json com `typingIndicator: true` e `messageDeliveryAndReadReceipts: true`.

⚠️ **App nativo NÃO compilado/testado em emulador** — apenas o tema TypeScript foi atualizado.

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
