# 🏥 Bem Estar - Sistema de Gestão de Saúde

Sistema completo de gestão de consultas e exames médicos desenvolvido em React Native com Firebase.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração do Firebase](#configuração-do-firebase)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Telas do Aplicativo](#telas-do-aplicativo)
- [Fluxo de Uso](#fluxo-de-uso)
- [Pontos Finais](#pontos-finais)

---

## Sobre o Projeto

O App da clínica **Bem Estar** é um aplicativo mobile que facilita o gerenciamento de consultas e exames médicos, permitindo aos usuários:
- Agendar consultas e exames
- Visualizar histórico de atendimentos
- Acessar resultados de exames
- Realizar consultas online (telemedicina)
- Gerenciar carteirinha digital do convênio
- Entrar em contato com suporte

---
## Motivações e Objetivo

Este App foi criado em por conta de uma projeto da matéria de Engenharia de Software, onde deveriamos desenvolver uma clínica médica.
A ideia dele é ser o aplicativo que o paciente da clínica iria usar, nele foi implementada as principais funcionalidades necessárias para o uso diário e efetivo do paciente, deixando intuitiva a interação. 

---
## Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Autenticação via Firebase Authentication

### 📅 Agendamentos
- Agendar consultas e exames
- Escolha de especialidade médica
- Seleção de profissional
- Calendário dinâmico (próximos 5 dias)
- Grade de horários disponíveis

### 📊 Meus Agendamentos
- Visualização de agendamentos futuros
- Histórico de consultas e exames realizados
- Confirmação de comparecimento (feito/não feito)
- Cancelamento de agendamentos

### 👩🏻‍💻 Consulta Online
- Listagem de consultas online agendadas
- Botão "Entrar" disponível 15 minutos antes
- Contador de tempo em tempo real
- Indicador visual de disponibilidade

### 🏥 Resultados de Exames
- Visualização de exames realizados
- Resultados disponíveis após confirmação
- Histórico completo de exames

### 💳 Carteirinha Digital
- Cadastro de carteirinha do convênio
- Informações: categoria, número e validade
- Visualização rotacionada (formato cartão)

### 📞 Suporte
- Ligação direta via telefone
- Contato por WhatsApp (app ou web)

---

## Tecnologias Utilizadas

### Mobile (Paciente)
- **React Native** - Framework mobile multiplataforma
- **Snack Expo** - Plataforma de desenvolvimento e prototipação
- **Firebase SDK (v8.2.3)** 
  - Authentication - Autenticação de usuários
  - Realtime Database - Banco de dados em tempo real
- **React Navigation** - Sistema de navegação entre telas
  - @react-navigation/native - Core de navegação
  - @react-navigation/stack - Navegação em pilha
- **React Native Gesture Handler** - Gerenciamento de gestos e toques
- **React Native Safe Area Context** - Gerenciamento de áreas seguras (notch, barra de status)
- **Expo AV** - Manipulação de áudio e vídeo (para consultas online)

### Backend
- **Firebase Authentication** - Gerenciamento de autenticação
- **Firebase Realtime Database** - Armazenamento de dados em tempo real

---

##  Estrutura do Projeto
```
app-eng-software/
├── assets/
│   └── imagens/
│       ├── amoxilina.png
│       ├── ibuprofeno.png
│       ├── Losartana.png
│       ├── Metformina.png
│       └── omeprazol.png
├── config/
│   └── config.js                     # Configuração do Firebase
├── components/
│   ├── InicioScreen.js               # Tela inicial (Login/Cadastro)
│   ├── LoginScreen.js                # Tela de login
│   ├── CadastroScreen.js             # Tela de cadastro
│   ├── HomeScreen.js                 # Tela principal (menu)
│   └── HomeScreens/
|       ├── AgendarScreen.js          # Agendamento de consultas/exames
│       ├── MeusAgendamentosScreen.js # Visualização de agendamentos
│       ├── CarteirinhaScreen.js      # Carteirinha digital
│       ├── ConsultaOnlineScreen.js   # Consultas online
│       ├── ResultadoExameScreen.js   # Resultados de exames
│       ├── SuporteScreen.js          # Suporte ao cliente
│       └── ReceitaScreen.js          # Receitas médicas
├── App.js                            # Arquivo principal
├── package.json                      # Dependências do projeto
└── README.md                         # Documentação
```
---

## Configuração do Firebase

### 1. Criar projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga os passos de criação

### 2. Configurar Authentication

1. No menu lateral, vá em **Authentication**
2. Clique em **Get Started**
3. Ative o método **Email/Password**

### 3. Configurar Realtime Database

1. No menu lateral, vá em **Realtime Database**
2. Clique em **Criar banco de dados**
3. Escolha o local (geralmente `us-central1`)
4. Inicie em **modo de teste** (regras serão configuradas depois)

### 4. Obter credenciais

1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Em **Seus aplicativos**, clique no ícone web `</>`
3. Copie as credenciais do Firebase

### 5. Configurar o arquivo `config/config.js`

Crie o arquivo `config/config.js` e adicione suas credenciais:
```javascript
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://SEU_PROJECT_ID.firebaseio.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_MESSAGING_ID",
  appId: "SEU_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
```

### 6. Configurar regras de segurança

No Firebase Console, vá em **Realtime Database > Regras** e configure:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "carteiras": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "agendados": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId"]
    },
    "historico": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId"]
    }
  }
}
```

---

## Executando o Projeto

### Passos:

Acesse o projeto no Snack: (https://snack.expo.dev/@lesgooou/app-eng-software)
O código já está pronto para executar
Escolha uma das opções abaixo para visualizar:

### 📱 Testar no Celular (Recomendado)

Instale o app Expo Go (Android | iOS)
Abra o Expo Go e escaneie o QR Code que aparece no Snack
O app abrirá automaticamente no seu celular

### 🌐 Testar no Navegador

Clique em "Web" no painel direito do Snack
O app abrirá em uma janela de preview (funcionalidades limitadas)
Não é recomendado pois o App foi criado voltado para o uso pelo celular, o que limita as interações com computador via Web

### 📲 Testar em Emulador (Android/iOS)

Clique em "Android" ou "iOS" no painel direito
Aguarde o emulador carregar (pode demorar alguns minutos)

---

## Estrutura do Banco de Dados

### **users/** - Dados dos usuários
```javascript
{
  "userId": {
    "nome": "Gabriel Oliveira",
    "email": "gabriel@email.com",
    "criadoEm": "2025-10-29T14:30:00.000Z"
  }
}
```

### **carteiras/** - Carteirinhas digitais
```javascript
{
  "userId": {
    "userId": "abc123",
    "nome": "Gabriel Oliveira",
    "categoria": "Unimed",
    "numero": "1234 5678 9012",
    "validade": "12/2028",
    "criadaEm": "2025-10-29T14:30:00.000Z"
  }
}
```

### **agendados/** - Agendamentos futuros
```javascript
{
  "agendamentoId": {
    "userId": "abc123",
    "tipo": "Consulta",
    "especialidade": "Cardiologia",
    "profissional": "Dr. Carlos Silva",
    "data": "2025-10-31",
    "horario": "09:00",
    "criadoEm": "2025-10-29T14:30:00.000Z"
  }
}
```

### **historico/** - Histórico de atendimentos
```javascript
{
  "historicoId": {
    "userId": "abc123",
    "tipo": "Exame",
    "especialidade": "Hemograma Completo",
    "profissional": "Lab Central",
    "data": "2025-10-28",
    "horario": "08:00",
    "feito": true,
    "criadoEm": "2025-10-28T14:30:00.000Z",
    "movido_em": "2025-10-29T10:00:00.000Z"
  }
}
```

---

## Telas do Aplicativo

### 🏠 Tela Inicial
- Apresentação do app
- Opções de Login e Cadastro

### 🔑 Login
- Autenticação com email e senha
- Validação de campos
- Navegação para Home após login

### ✍️ Cadastro
- Criação de nova conta
- Campos: Nome, Email, Senha
- Salva dados em `/users/{userId}`

### 🏥 Home
- Menu principal com cards
- Acesso rápido a todas as funcionalidades
- Botão de logout

### 📅 Agendar
- Fluxo progressivo de agendamento
- Seleção de tipo (Consulta/Exame)
- Escolha de especialidade
- Seleção de profissional
- Calendário dinâmico (5 dias futuros)
- Grade de horários

### 📋 Meus Agendamentos
- **Tab "Próximos"**: Agendamentos futuros
- **Tab "Histórico"**: 
  - Pendentes de confirmação (Sim/Não)
  - Histórico completo (já confirmados)

### 💳 Carteirinha
- Cadastro de dados do convênio
- Visualização rotacionada (paisagem)
- Campos: Categoria, Número, Validade

### 🎥 Consulta Online
- Lista de consultas online
- Informações: Data, Hora, Profissional
- Contador de tempo restante
- Botão "Entrar" (15 min antes)

### 📊 Resultados de Exames
- Exames e consultas realizados
- Badge "Disponível"
- Botão "Ver Resultado"

### 📞 Suporte
- Ligação direta
- WhatsApp (app ou web)
- Horário de atendimento

---

## Fluxo de Uso

### Fluxo de Agendamento
```
1. Usuário acessa "Agendar"
   ↓
2. Escolhe tipo (Consulta/Exame)
   ↓
3. Seleciona especialidade
   ↓
4. Escolhe profissional
   ↓
5. Seleciona data (próximos 5 dias)
   ↓
6. Escolhe horário
   ↓
7. Confirma agendamento
   ↓
8. Salvo em /agendados
```

### Fluxo de Histórico
```
1. Agendamento passa da data/hora
   ↓
2. Aparece em "Histórico" > "Pendentes"
   ↓
3. Usuário confirma: "Feito?" → Sim/Não
   ↓
4. Move de /agendados para /historico
   ↓
5. Adiciona campo: feito: true/false
   ↓
6. Aparece em "Histórico Completo"
   ↓
7. Se feito=true → Aparece em "Resultados"
```

### Fluxo de Consulta Online
```
1. Consulta agendada em /agendados
   ↓
2. Aparece em "Consulta Online"
   ↓
3. Quando faltam 15 min → Botão "Entrar"
   ↓
4. Usuário clica → Inicia videochamada
   (lógica a ser implementada)
```

---
## Demonstração

Vídeo fazendo a utilização do App. link: https://youtu.be/ETtLVqV46cY

---
## Próximos Passos: 

Como melhorias pode-se considerar a conexão com o App do médico/funcionário, onde assim traria resultado para os exames, seria possível visualizar receitas médicas passadas pelo médico e possivelmente até se comunicar com o médico pela Consulta Online
