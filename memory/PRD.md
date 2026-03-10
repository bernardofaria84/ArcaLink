# ArcaLink — Product Requirements Document

**Data de criação:** Março 2026  
**Versão:** v1.0.0-MVP  
**Repositório:** bernardofaria84/ArcaLink (branch: v5)  
**Stack:** React Native 0.81.4 + TypeScript 5.8.3 + CometChat UIKit v5.2.11 + React Navigation 7 + Zustand 5

---

## 1. VISÃO DO PRODUTO

ArcaLink é um aplicativo de comunicação segura para a área médica, que conecta médicos, equipes de saúde e pacientes em grupos de chat privados, eliminando a necessidade de médicos usarem seus números pessoais de WhatsApp.

**Domínios:** arcalink.com.br / arcalink.ai.br  
**Lojas alvo:** App Store (iOS) + Google Play (Android)  
**Conformidade:** LGPD (Lei Geral de Proteção de Dados)  

---

## 2. CREDENCIAIS DE PRODUÇÃO (MVP)

| Parâmetro | Valor |
|-----------|-------|
| appId | 1676216c370017025 |
| authKey | ca81cc34b6ce9e46fa7c685bcf3a90a0940b54c9 |
| region | us |

**Usuários de teste:**
- `dr.joao@clinica.com` / senha: `senha123` → UID: `cometchat-uid-1` (médico)
- `maria.silva@email.com` / senha: `senha123` → UID: `cometchat-uid-2` (paciente)

---

## 3. PAPÉIS DE USUÁRIO

| Role | Nome | Permissões |
|------|------|-----------|
| `medico` | Médico | Criar grupos, adicionar/remover membros, encerrar grupos, enviar mensagens |
| `paciente` | Paciente | Participar de grupos por convite, enviar mensagens, mencionar participantes |

---

## 4. IDENTIDADE VISUAL

**Paleta de Cores:**
- Primary: `#0A6E6E` (verde-azulado médico)
- Primary Light: `#E6F3F3`
- Secondary: `#1A4A7A`
- Error: `#C0392B`
- Success: `#2D9E6B`
- Background: `#F7FAFC`

**Tipografia:** Inter (Regular, Medium, Bold)  
**Nome:** ArcaLink  
**Tagline:** "Comunicação médica segura"

---

## 5. ARQUITETURA DE ARQUIVOS

```
examples/SampleApp/
├── App.tsx                          ✅ Tema ArcaLink + pt-BR i18n
├── src/
│   ├── navigation/
│   │   ├── RootStackNavigator.tsx   ✅ LoginScreen em vez de SampleUser
│   │   ├── BottomTabNavigator.tsx   ✅ Conversas, Grupos, Perfil
│   │   └── types.ts                 ✅ BottomTabParamList atualizado
│   ├── components/
│   │   ├── login/
│   │   │   └── LoginScreen.tsx      ✅ NOVO: email + senha, ArcaLink branding
│   │   ├── conversations/
│   │   │   └── screens/
│   │   │       ├── GroupInfo.tsx     ✅ Botão "Encerrar Grupo" + modal LGPD
│   │   │       └── Conversations.tsx ✅ Logout → Login, sem AI
│   │   ├── groups/
│   │   │   ├── Groups.tsx            ✅ Role check médico para criar grupos
│   │   │   ├── GroupHelper.tsx       ✅ Apenas grupos Privados
│   │   │   └── CriarGrupoMedico.tsx  ✅ NOVO: fluxo médico, busca paciente
│   │   └── perfil/
│   │       └── PerfilScreen.tsx      ✅ NOVO: perfil + logout
│   ├── hooks/
│   │   └── useUserRole.ts            ✅ NOVO: hook de verificação de role
│   ├── localization/
│   │   └── pt-BR.ts                  ✅ NOVO: traduções em português
│   ├── theme/
│   │   └── ArcaLinkTheme.ts          ✅ NOVO: tema visual ArcaLink
│   ├── config/
│   │   └── config.json               ✅ Tema verde, tabs, features ArcaLink
│   └── utils/
│       └── AppConstants.tsx          ✅ Credenciais ArcaLink + PERFIL constant
```

---

## 6. O QUE FOI IMPLEMENTADO (MVP - Março 2026)

### ✅ Tarefa 1 — Sistema de Autenticação
- LoginScreen.tsx com email + senha
- Validação de formato de email
- Campo senha com show/hide
- Mapeamento MVP: email → UID CometChat
- Comentários claros para migração para backend + JWT em produção

### ✅ Tarefa 2 — Identidade Visual
- Paleta de cores ArcaLink (#0A6E6E)
- Tipografia Inter
- Branding "ArcaLink" em toda a interface
- config.json atualizado com cores e tipografia

### ✅ Tarefa 3 — Navegação
- Removidas abas Users e Calls da barra de navegação
- Mantidas: Conversas (Chats) e Grupos
- Adicionada aba Perfil

### ✅ Tarefa 4 — Controle de Permissões
- Hook `useUserRole` implementado
- Botão criar grupo visível somente para médicos
- GroupInfo: "Encerrar Grupo" somente para médicos

### ✅ Tarefa 5 — Sem Atendente Virtual
- AI Assistants removido do menu de Conversas
- aiUserCopilot desabilitado no config.json

### ✅ Tarefa 6 — Features do Chat
- videoSharing: false
- messageTranslation: false
- polls: false
- collaborativeWhiteboard: false
- collaborativeDocument: false
- stickers: false
- joinLeaveGroup: false
- banUsers: false

### ⏳ Tarefa 7 — Notificações Push
- Adiado para versão pós-MVP
- fcmProviderId e apnsProviderId placeholder em AppConstants

### ✅ Tarefa 8 — Internacionalização pt-BR
- Arquivo pt-BR.ts com +80 chaves de tradução
- CometChatI18nProvider configurado com selectedLanguage="pt"

### ✅ Tarefa 9 — Tela de Perfil
- PerfilScreen.tsx com avatar, nome, email, role, CRM (médicos)
- Logout com confirmação + limpeza de AsyncStorage

### ✅ Tarefa 10 — Encerramento de Grupo
- Botão "Encerrar Grupo" em GroupInfo (médicos owner/admin apenas)
- Modal de confirmação com texto LGPD
- Envio de mensagem automática
- Remoção de todos os membros exceto o médico
- Navegação de volta

---

## 7. BACKLOG PRIORIZADO

### P0 — Crítico (Antes do Lançamento)
- [ ] Backend ArcaLink: API de autenticação com JWT
- [ ] Substituir login MVP (email→UID) por CometChatUIKit.login({ authToken })
- [ ] Configurar Push Notifications (FCM + APNs)
- [ ] Adicionar mais usuários de teste no CometChat
- [ ] Testar em emulador iOS e Android

### P1 — Alta Prioridade
- [ ] Logo definitivo do ArcaLink (substituir placeholder de texto)
- [ ] Splash screen com identidade ArcaLink
- [ ] CRM de médicos via metadata do CometChat ou backend
- [ ] Edição de perfil (foto, nome)
- [ ] Recuperação de senha

### P2 — Médio Prazo
- [ ] Filtro de pacientes por CPF na busca do CriarGrupoMedico
- [ ] Dashboard de consultas para médicos
- [ ] Arquivamento de grupos (sem exclusão física)
- [ ] Relatórios de conformidade LGPD
- [ ] Tema Dark Mode

### Futuro / Nice-to-Have
- [ ] Atendente virtual IA (TAREFA 5 — versão futura)
- [ ] Integração com prontuário eletrônico
- [ ] Assinatura digital de documentos

---

## 8. INSTRUÇÕES DE BUILD

```bash
# Clone o repositório
git clone -b v5 https://github.com/bernardofaria84/ArcaLink.git
cd ArcaLink/examples/SampleApp

# Instalar dependências
yarn install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

---

## 9. NOTAS TÉCNICAS IMPORTANTES

1. **Nunca alterar `packages/ChatUiKit/`** — código do UIKit CometChat
2. **Login MVP**: usa `uid` diretamente. Produção deve usar `authToken` via backend
3. **Grupos**: SEMPRE do tipo PRIVATE no ArcaLink (regra de negócio)
4. **LGPD**: mensagens preservadas 6 meses após encerramento de grupo
5. **Credenciais**: nunca commitar authKey em repositório público
