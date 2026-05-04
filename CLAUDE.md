# 📒 CLAUDE.md — Diário de Bordo do Projeto ArcaLink

> Documento de continuidade técnica do agente Claude (Emergent E1).  
> Última atualização: **04 / Maio / 2026**  
> Versão atual do app: **v1.0.0-MVP** (Web Preview)

---

## 1. 🎯 Visão Geral do Projeto

**ArcaLink** é um aplicativo de **comunicação médica segura**, voltado ao mercado brasileiro, em conformidade com a **LGPD**. Construído sobre o **CometChat UIKit**, com identidade visual própria (teal `#0A6E6E`) e UX inspirada no WhatsApp para garantir adoção rápida por médicos e pacientes.

**Personas:**
- **Médico** (`role: medico`): cria grupos privados de consulta, inicia conversas, gerencia pacientes.
- **Paciente** (`role: paciente`): conversa apenas dentro dos grupos onde foi convidado.

**Domínio:** `arcalink.com.br`  
**Tagline:** *"Comunicação médica segura"*

---

## 2. 🏗️ Arquitetura Atual

```
/app
├── arcalink/                       # 📱 App React Native real (produto final)
│   ├── examples/SampleApp/         # Implementação principal
│   │   ├── App.tsx                 # Init UIKit, Theme, i18n PT-BR
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── login/LoginScreen.tsx
│   │   │   │   ├── conversations/screens/Messages.tsx
│   │   │   │   ├── perfil/PerfilScreen.tsx
│   │   │   │   └── …
│   │   │   ├── localization/pt-BR.ts   # 166 chaves PT-BR
│   │   │   ├── config/config.json      # Feature flags (typing, receipts, calls)
│   │   │   └── utils/AppConstants.tsx  # CometChat App ID, Auth Key, Region
│   │   └── package.json            # RN 0.81.4 + UIKit 5.2.11
│   └── packages/ChatUiKit/         # UIKit fork local (intocado)
│
├── frontend/                       # 🌐 Web Preview (apenas demo/marketing)
│   ├── public/
│   ├── src/
│   │   ├── App.js                  # Init UIKit, CometChatLocalize('pt'), splash
│   │   ├── App.css                 # Tema WhatsApp (overrides CometChat)
│   │   ├── i18n/ptBR.js            # Referência (não usada — locale 'pt' embutido)
│   │   ├── cometchat-config.js     # appId / authKey / region (lê de .env)
│   │   └── components/
│   │       ├── ChatApp.js          # Lógica chat, abas, modais
│   │       ├── ChatApp.css         # Layout chat-view, header, scroll
│   │       ├── LoginPage.js
│   │       ├── LoginPage.css
│   │       └── PhoneMockup.js      # Mockup iPhone para preview
│   ├── .env                        # REACT_APP_BACKEND_URL + CometChat keys
│   └── package.json                # React 18 + UIKit React 6.3.11
│
├── backend/                        # ⚙️ FastAPI mínimo (apenas health)
│   ├── server.py                   # Rota raiz `/api/`
│   ├── .env                        # MONGO_URL, DB_NAME
│   └── requirements.txt
│
├── memory/                         # 📋 Documentação interna do agente
│   ├── PRD.md                      # Product Requirements Doc
│   └── test_credentials.md         # Credenciais para testes
│
├── test_reports/                   # Relatórios JSON do testing agent
│   ├── iteration_1.json
│   └── iteration_2.json
│
├── design_guidelines.md            # Diretrizes de design
└── CLAUDE.md                       # 📒 ESTE ARQUIVO
```

---

## 3. 🔑 Chaves, Tokens e Credenciais

### 3.1 CometChat (mesma para web e nativo)

| Variável | Valor | Onde está armazenada |
|---|---|---|
| **App ID** | `1676216c370017025` | `frontend/.env` → `REACT_APP_COMETCHAT_APP_ID`<br>`arcalink/examples/SampleApp/src/utils/AppConstants.tsx` |
| **Auth Key** | `ca81cc34b6ce9e46fa7c685bcf3a90a0940b54c9` | `frontend/.env` → `REACT_APP_COMETCHAT_AUTH_KEY`<br>`AppConstants.tsx` |
| **Region** | `us` | `frontend/.env` → `REACT_APP_COMETCHAT_REGION` |
| **Builder ID** | `arcalink-mvp-v1` | `arcalink/examples/SampleApp/src/config/config.json` |

> ⚠️ **PRODUÇÃO:** Mover Auth Key para o backend (gerar Auth Token por usuário em vez de Auth Key global).

### 3.2 Backend / Infra

| Variável | Valor | Local |
|---|---|---|
| **REACT_APP_BACKEND_URL** | `https://secure-health-comm-1.preview.emergentagent.com` | `frontend/.env` |
| **MONGO_URL** | `mongodb://localhost:27017` | `backend/.env` |
| **DB_NAME** | `arcalink` | `backend/.env` |

### 3.3 Push Notifications (ainda não configurado)

| Variável | Valor atual | Onde configurar quando ativar |
|---|---|---|
| **fcmProviderId** | `''` (vazio) | `AppConstants.tsx` |
| **apnsProviderId** | `''` (vazio) | `AppConstants.tsx` |

### 3.4 Contas de Demonstração (ambos os apps)

| Papel | E-mail | Senha | UID CometChat |
|---|---|---|---|
| Médico | `dr.joao@clinica.com` | `senha123` | `cometchat-uid-1` (no nativo) / `dr_joao` (no web) |
| Paciente | `maria.silva@email.com` | `senha123` | `cometchat-uid-2` (no nativo) / `maria_silva` (no web) |

> Mapeamento exato em `LoginScreen.tsx` (RN) e `LoginPage.js` (web). Documentado em `/app/memory/test_credentials.md`.

---

## 4. 🛠️ Stack Tecnológico Completo

### 4.1 Web Preview (`/app/frontend`)
- **React** 18
- **CometChat UIKit React** v6.3.11 (`@cometchat/chat-uikit-react`)
- **CometChat SDK JavaScript** (peer dep do UIKit)
- **React Scripts** (CRA)
- CSS puro com overrides via CSS Variables do CometChat

### 4.2 React Native Native App (`/app/arcalink/examples/SampleApp`)
- **React Native** 0.81.4
- **React** 19.1.0
- **CometChat UIKit React Native** v5.2.11 (`@cometchat/chat-uikit-react-native`)
- **CometChat Chat SDK RN** v4.0.20
- **CometChat Calls SDK RN** v4.4.0 (voz/vídeo)
- **React Navigation** v7 (`stack` + `bottom-tabs`)
- **react-native-webrtc** v124 (chamadas)
- **react-native-vision-camera** v4 (foto/vídeo)
- **react-native-svg**, **react-native-video**, **react-native-gesture-handler**, **react-native-screens**, **react-native-safe-area-context**
- **AsyncStorage** (persistência local)
- **Zustand** v5 (state management — `useConfig`)
- **dayjs** v1.11 (formatação de datas)

### 4.3 Backend (`/app/backend`)
- **FastAPI** 0.115.0
- **Uvicorn** 0.30.6
- **python-dotenv** 1.0.0
- **MongoDB** (configurado mas não utilizado no MVP)

### 4.4 Plugins / Plug-ins do CometChat ativados
Configurados em `arcalink/examples/SampleApp/src/config/config.json`:

**Core Messaging:**
- ✅ `typingIndicator`
- ✅ `messageDeliveryAndReadReceipts`
- ✅ `userAndFriendsPresence`
- ✅ `editMessage`, `deleteMessage`
- ✅ `photosSharing`, `audioSharing`, `fileSharing`
- ❌ `videoSharing`

**Engagement:**
- ✅ `mentions`, `reactions`, `voiceNotes`, `emojis`, `userInfo`, `groupInfo`
- ❌ `messageTranslation`, `polls`, `collaborativeWhiteboard`, `collaborativeDocument`, `stickers`

**Calls:**
- ✅ Voz e vídeo 1:1 + conferência em grupo

**Privacy:**
- ✅ `sendPrivateMessageToGroupMembers`

---

## 5. 📜 Diário de Bordo — O que foi feito

### Fase 1 — MVP Web Preview (sessão anterior)
**Implementado:**
- Tela de login com email/senha + botões demo (Médico/Paciente)
- Mockup de iPhone (`PhoneMockup.js`) renderizando o app em viewport mobile
- 3 abas: **Conversas**, **Grupos**, **Perfil**
- Modal "Nova Conversa" (busca usuários CometChat)
- Modal "Criar Grupo Médico" (sempre PRIVATE, médico-only)
- Modal "Editar Perfil" (atualiza display name via `updateCurrentUserDetails`)
- Modal "Sair da Conta" (substitui `window.confirm()` que é bloqueado em iframes)
- Splash screen com gradiente teal→azul

**Acertos:**
- Decisão de criar mockup de iPhone para preview (visualização realista do produto final)
- Separar Web Preview do app Native (web é apenas demo)
- Modal customizado para logout (descobriu-se cedo que `confirm()` falha em iframes)

**Erros e correções:**
- ❌ Inicialmente usava `CometChat.login()` → não inicializava DataSource → balões sem renderizar
  - ✅ **Fix:** trocar para `CometChatUIKit.login()`
- ❌ CSS do CometChat não estava importado → componentes sem estilo
  - ✅ **Fix:** importar `@cometchat/chat-uikit-react/css-variables.css` em `App.js`

---

### Fase 2 — Identidade Visual WhatsApp (sessão anterior, 11/03/2026)
**Implementado:**
- Override de CSS Variables do CometChat:
  - `--cometchat-primary-color: #0A6E6E` (teal ArcaLink)
  - `--cometchat-extended-primary-color-500: #0A6E6E` (avatares, botões)
- Bubbles WhatsApp:
  - Outgoing: teal `#0A6E6E` com texto branco, border-radius `8px 0 8px 8px`
  - Incoming: branco com texto escuro, border-radius `0 8px 8px 8px`
  - Background: areia `#ECE5DD` (idêntico WhatsApp)
- Header do chat com fundo teal usando técnica de **CSS variable scoped**:
  ```css
  .chat-view-header {
    --cometchat-background-color-01: transparent;
  }
  ```
- Botão de voltar customizado `←` (CometChat web não renderiza back por padrão)
- Composer estilizado: `+`, microfone, emoji, sticker, botão enviar circular teal
- Internacionalização **PT-BR** via `CometChatLocalize.init({language: 'pt'})` (locale embutido no UIKit)

**Acertos:**
- Override via CSS Variables (não força !important em tudo)
- Variable scoped no `.chat-view-header` para deixar o header interno transparente sem afetar outras telas

**Erros e correções:**
- ❌ Logout disparava overlay de erro do React (race condition)
  - ✅ **Fix:** `setTimeout(150ms)` antes de remover componentes
- ❌ Avatar do leading-view ficava cortado (29px em vez de 48px)
  - ✅ **Fix:** `box-sizing: border-box` global colidia com padding interno → override `padding: 0 !important`

---

### Fase 3 — Auto-scroll WhatsApp-style (sessão atual, 04/05/2026)
**Implementado:**
- Prop `scrollToBottomOnNewMessages={true}` em ambos `<CometChatMessageList>` (chat individual + grupo)
- Overrides de CSS para constrir o chain de wrappers e permitir scroll interno

**Acerto:**
- Inspeção via DevTools confirmou a **causa raiz**: `.cometchat` (wrapper) tinha `flex: 0 1 auto; display: block` e altura natural de **1418px** dentro de um container de **504px** — ignorava `height: 100%`.
- Solução cirúrgica: forçar `flex: 1 1 0; min-height: 0; max-height: 100%; display: flex` em todo o chain.

**Erros e correções:**
- ❌ Primeira tentativa: apenas a prop `scrollToBottomOnNewMessages` → não resolveu (overflow não estava ativo)
  - ✅ **Fix:** identificar via `getComputedStyle` que `clientHeight === scrollHeight` (= sem overflow) e adicionar overrides de altura.

**Validação final:**
```
After 10 mensagens: scrollTop=1642, scrollHeight=2146, clientHeight=504
overflow=True, atBottom=True  ✅
```

---

### Fase 4 — Recibos azuis + Typing destacado + Sync RN (sessão atual, 04/05/2026)
**Implementado (Web):**
- Override de `--cometchat-message-seen-color: #53BDEB` (azul WhatsApp)
- Selector correto identificado: `.cometchat-message-bubble__status-info-view-receipts-read .cometchat-message-list__receipt`
- Typing indicator no header destacado: `#B2EFEF` italic bold

**Implementado (Native — `arcalink/examples/SampleApp/App.tsx`):**
- Objeto `arcaWhatsAppOverride` aplicado ao `CometChatThemeProvider`:
  - `messageListStyles.containerStyle.backgroundColor = '#ECE5DD'`
  - `messageListStyles.outgoingMessageBubbleStyles.containerStyle.backgroundColor = '#0A6E6E'`
  - `messageListStyles.incomingMessageBubbleStyles.containerStyle.backgroundColor = '#FFFFFF'`
  - `messageHeaderStyles.containerStyle.backgroundColor = '#0A6E6E'`
  - `messageHeaderStyles.titleTextStyle.color = '#FFFFFF'`
  - `messageHeaderStyles.typingIndicatorTextStyle.color = '#B2EFEF'`
  - `receiptStyles.readIconStyle.tintColor = '#53BDEB'`

**Acertos:**
- Inspeção do CSS interno do UIKit (`/node_modules/.../components/CometChatMessageList.css`) revelou que CometChat web usa **CSS masks SVG** em vez de modifier classes — selector real é `__status-info-view-receipts-read`
- Identificação dos type-defs corretos no Native (`titleTextStyle`, não `titleStyle`; `typingIndicatorTextStyle`, não `typingIndicatorStyle.textStyle`)

**Erros e correções:**
- ❌ Primeira tentativa de seletor de recibo lida foi `.cometchat-receipt--read` (que não existe) → retornava `found: false`
  - ✅ **Fix:** grep no node_modules e descoberta do selector real
- ❌ Tema RN inicialmente com keys erradas (`titleStyle`, `subtitleStyle`)
  - ✅ **Fix:** consultar `/app/arcalink/packages/ChatUiKit/src/CometChatMessageHeader/styles.ts` e usar nomes reais

**Validação final:**
```
seenColorVar: '#53BDEB'
read receipt computed: rgb(83, 189, 235)  ✅
sent receipt: rgba(255,255,255,0.85)  ✅
auto-scroll preservado: atBottom=True  ✅
```

---

## 6. 🎓 Lições Aprendidas

### 6.1 CometChat Web UIKit
1. **Sempre importar o CSS** do UIKit antes de tentar overrides:
   ```js
   import '@cometchat/chat-uikit-react/css-variables.css';
   import '@cometchat/chat-uikit-react/index.css';
   ```
2. **Use CSS Variables, não !important em massa.** O UIKit é desenhado para customização via tokens (`--cometchat-primary-color`, `--cometchat-message-seen-color`, etc.).
3. **CSS scoped variables** funcionam para mudar comportamento dentro de um wrapper:
   ```css
   .chat-view-header { --cometchat-background-color-01: transparent; }
   ```
4. **Recibos usam SVG masks**, não classes modifier. Selector real:
   `.cometchat-message-bubble__status-info-view-receipts-{wait|sent|delivered|read} .cometchat-message-list__receipt`
5. **Login deve ser via `CometChatUIKit.login()`**, não `CometChat.login()` — o segundo não inicializa DataSource e quebra a renderização de bubbles.

### 6.2 Layout Flexbox + CometChat
- Quando o componente CometChat fica "gigante" e ignora `height: 100%`, **inspecionar `getComputedStyle` em todo o chain** (do container até o `__body` interno).
- Solução padrão: forçar `flex: 1 1 0; min-height: 0; max-height: 100%; display: flex; flex-direction: column` em cada wrapper aninhado.
- `.cometchat-list__body` é o **único elemento que faz scroll de fato** — todos os pais são apenas containers flex.

### 6.3 React Native UIKit (CometChat)
- O tema é injetado via `<CometChatThemeProvider theme={…}>` com `light` + `dark` separados.
- **Type-defs canônicos** estão em `packages/ChatUiKit/src/<Component>/styles.ts` (ex: `MessageHeaderStyle`, `ReceiptStyles`).
- A arquitetura usa **Zustand store** (`useConfig`) lendo de `config.json` para feature flags.
- `disableTypingEvents={!typingIndicator}` e `receiptsVisibility={messageDeliveryAndReadReceipts}` são as props que ligam o config às props do componente.

### 6.4 Iframe / Preview
- `window.confirm()` e `window.alert()` são **bloqueados em iframes sandboxed** → criar modais customizados sempre.
- Logout precisa de `setTimeout` para evitar React Error Overlay (componente desmontando enquanto outro emite evento).

### 6.5 Debugging via Screenshot Tool
- Usar `page.evaluate()` para extrair `scrollHeight`, `clientHeight`, `scrollTop`, `getComputedStyle` é mais preciso que olhar visualmente.
- O screenshot tool aceita scripts Python Playwright completos — útil para enviar mensagens e validar resultado em um único call.

---

## 7. 📊 Status Atual (snapshot)

### Web Preview
| Funcionalidade | Status |
|---|---|
| Login email/senha | ✅ Funcional (mock) |
| Lista de conversas | ✅ |
| Chat individual + grupo | ✅ |
| Auto-scroll para fim | ✅ |
| Recibos lidos (azul WhatsApp) | ✅ |
| Recibos enviado/entregue | ✅ |
| Typing indicator | ✅ |
| Editar perfil | ✅ |
| Logout | ✅ |
| PT-BR completo | ✅ |
| Visual WhatsApp | ✅ |

### Native App
| Funcionalidade | Status |
|---|---|
| Init UIKit | ✅ Código pronto |
| i18n PT-BR | ✅ 166 chaves |
| Tema WhatsApp | ✅ Aplicado em `App.tsx` |
| Typing + Receipts | ✅ Ativados via `config.json` |
| Compilação Android | ⚠️ **NÃO TESTADO** |
| Compilação iOS | ⚠️ **NÃO TESTADO** |

### Testes
- ✅ Iteração 2 do testing agent: **7/7 passando** (Back button, logout, envio mensagem, lista conversas, PT-BR, grupos, login paciente)

---

## 8. 🚧 Pendências (Backlog imediato)

### P0 — Bloqueadores antes do lançamento
- [ ] **Compilar e testar `/app/arcalink` em emulador Android e iOS** — nunca foi rodado em dispositivo desde que recebeu as customizações ArcaLink
- [ ] **Backend de autenticação real (JWT)** substituindo o `MVP_USER_MAP` (atualmente o mapeamento email→UID está hardcoded em ambos os apps)
- [ ] **Auth Token por usuário** via backend, removendo Auth Key global do client (segurança LGPD)

### P1 — Funcionalidades importantes próximas
- [ ] **Push notifications** (FCM Android + APNs iOS) — `fcmProviderId` e `apnsProviderId` estão vazios em `AppConstants.tsx`
- [ ] **"Esqueci minha senha"** com link de reset (atualmente mostra apenas "disponível em breve")
- [ ] **Fluxo "Encerrar Grupo de Consulta"** funcional no web preview (botão existe mas sem ação)
- [ ] **Foto de perfil** com upload (modal de Editar Perfil só atualiza nome hoje)
- [ ] **Indicador online/offline** em tempo real na lista de conversas (atualmente usa apenas o subtítulo padrão)

### P2 — Melhorias UX/visuais
- [ ] **Busca de mensagens** (componente `SearchMessages` existe no nativo, falta integrar no web)
- [ ] **Reactions** em web preview (já ativado em config nativo, falta validar no web)
- [ ] **Voice notes** com waveform animado em playback no web (já estilizado, falta animação)
- [ ] **Avatar com hífen como inicial** ("Pre-Natal" mostra "P-") — corrigir geração de inicial para ignorar hífens

### P3 — Refatoração / Tech Debt
- [ ] **Sincronizar UID schema** entre web (`dr_joao`) e nativo (`cometchat-uid-1`) — mesmo email, UIDs diferentes
- [ ] Mover **CometChat keys** do `.env` frontend para um endpoint backend `/api/cometchat-config` (evita expor authKey no bundle)
- [ ] Quebrar `ChatApp.js` (atualmente ~700 linhas) em componentes menores (`ChatView`, `ChatHeader`, `ConversationsView`)
- [ ] Adicionar **testes unitários** com Jest no `/app/backend/tests/`
- [ ] Criar **CI/CD pipeline** com lint + testes automatizados

---

## 9. 🗺️ Roadmap (visão de longo prazo)

### Trimestre próximo (Q2 2026)
| Funcionalidade | Valor de negócio | Esforço |
|---|---|---|
| **Painel "Pacientes de hoje"** no perfil do médico | Diferencial vs WhatsApp; ajuda triagem | M |
| **Prontuário anexado** em grupo de consulta (PDF/imagem com tag clínica) | LGPD compliance; valor clínico | M |
| **Receituário digital** assinado (integração ICP-Brasil) | Diferencial regulatório | L |
| **Chamada de vídeo agendada** com lembrete via push | Telemedicina formal | M |
| **Sala de espera virtual** (paciente vê posição na fila) | Reduz ansiedade; aumenta retenção | S |

### Médio prazo (Q3-Q4 2026)
| Funcionalidade | Valor |
|---|---|
| **AI Assistant para médicos** — sumarização automática de conversas longas | Economiza tempo médico (CometChat já tem AI plugins) |
| **Tradução automática** PT↔EN↔ES para clínicas internacionais | Mercado expandido |
| **Histórico exportável** em PDF assinado para prontuário | Compliance LGPD/CFM |
| **Multi-clínica** (médicos em várias instituições) | B2B SaaS |
| **Integração calendário** (Google Calendar / Outlook) para agendamento | Conveniência |
| **Smart replies clinicamente seguras** (templates aprovados) | Velocidade sem risco médico |

### Visão de produto (12-18 meses)
- **Marketplace de especialistas** — paciente busca por especialidade e tira dúvidas pontuais (modelo telemedicina pay-per-message)
- **Integração com sistemas hospitalares** (HL7 FHIR) — prontuário unificado
- **Análise de sentimento** em tempo real para detectar urgência (paciente em crise)
- **Painel administrativo da clínica** com métricas (tempo de resposta, satisfação NPS, volume por especialidade)
- **App branco para clínicas** (white-label) — ArcaLink Enterprise
- **Compliance ANS / LGPD certificada** — selo público para diferenciação

### Tecnologias futuras a avaliar
- **WebRTC E2E encryption** customizado (acima do CometChat) para chamadas sensíveis
- **Blockchain para auditoria** de prontuários (tamper-proof log)
- **Server-side push notifications** com lambdas (resiliência)
- **PWA para o web preview** (instalação direta no celular sem App Store)

---

## 10. 📌 Documentos Relacionados
- `/app/memory/PRD.md` — Product Requirements Doc (atualizado a cada feature)
- `/app/memory/test_credentials.md` — Credenciais de teste atualizadas
- `/app/test_reports/iteration_*.json` — Relatórios do testing agent
- `/app/design_guidelines.md` — Diretrizes de design

---

## 11. ✍️ Convenções para o próximo agente
1. **Sempre ler este `CLAUDE.md` e `/app/memory/PRD.md` antes de qualquer mudança.**
2. **Não desconfigurar visual WhatsApp** já validado no web — usar especificidade alta se precisar sobrescrever classes do CometChat.
3. **Native app vs Web Preview**: o produto final é o **React Native** (`/app/arcalink`). O Web Preview é apenas demonstração/landing.
4. **Comentários `// ARCALINK:` ou `/* ARCALINK */`** marcam todas as customizações do projeto sobre o código original do CometChat. Manter o padrão.
5. **Todo override CSS** vai em `App.css` (globais) ou `ChatApp.css` (escopo de chat). Não adicionar `<style>` inline.
6. **Sempre testar com `screenshot tool` + `page.evaluate`** para validar comportamento de scroll/altura/cores antes de declarar feito.
7. **PT-BR é obrigatório** — inglês só em código/comentários.

---

*Documento mantido pelo agente Claude (E1) — Emergent Labs.*
*Para histórico completo de commits, consulte o repositório Git associado.*
