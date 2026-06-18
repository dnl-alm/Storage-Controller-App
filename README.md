# Storage Controller — Mobile

> Aplicativo mobile para monitoramento e controle de recursos operacionais, desenvolvido em React Native com Expo.

![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-52-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind-06B6D4?style=flat-square)

---

## Sobre o Projeto

O **Storage Controller Mobile** é o cliente mobile do sistema Storage Controller. Desenvolvido em React Native com Expo, o aplicativo permite que operadores monitorem e controlem recursos de bases e setores diretamente pelo celular — registrando consumos e reabastecimentos, visualizando alertas automáticos e acompanhando o histórico de operações em tempo real.

O app consome a [Storage Controller API](https://github.com/dnl-alm/Storage-Controller), uma API REST desenvolvida em Java com Spring Boot que centraliza toda a lógica de negócio do sistema.

> ⚠️ **Pré-requisito:** este aplicativo depende da Storage Controller API rodando localmente. Certifique-se de que a API está em execução em `http://localhost:8080` antes de iniciar o app. Veja as instruções em [Como Executar](#como-executar).

---

## Funcionalidades

- Login e cadastro de usuários (perfil Operator)
- Dashboard com resumo de recursos por status (OK, Atenção, Crítico)
- Listagem e filtro de recursos por status
- Detalhe do recurso com barra de capacidade e histórico de movimentações
- Registro de consumo e reabastecimento com validação em tempo real
- Listagem e resolução manual de alertas ativos
- Histórico completo de movimentações com filtro por tipo
- Cadastro e edição de recursos e setores
- Perfil do usuário com edição de dados
- Navegação por abas e telas de detalhe/formulário

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native | Framework mobile multiplataforma |
| Expo / Expo Router | Plataforma de build e navegação file-based |
| TypeScript | Tipagem estática |
| NativeWind (Tailwind CSS) | Estilização com classes utilitárias |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de schemas por entidade |
| AsyncStorage | Persistência local da sessão do usuário |
| Fetch API | Comunicação HTTP com a API REST |
| Expo Vector Icons | Ícones (MaterialIcons) |

---

## Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
src/
  app/               → Telas e rotas (Expo Router file-based routing)
    tabs/            → Abas principais (Dashboard, Recursos, Movimentações, Alertas, Histórico, Perfil)
    recurso/         → Detalhe, criação e edição de recursos
    movimentacao/    → Registro de movimentação
    setor/           → Criação e edição de setores
  components/        → Componentes visuais reutilizáveis
  context/           → Estado global de autenticação (AuthContext)
  hooks/             → Lógica de carregamento de dados por entidade
  lib/               → Cliente HTTP (http.ts) e tipos globais (types.ts)
  schemas/           → Schemas de validação Zod por entidade
  services/          → Chamadas à API REST por entidade
  global.css         → Diretivas Tailwind
```

### lib/
**`http.ts`** — cliente HTTP centralizado. Toda comunicação com a API passa por aqui. Define a `BASE_URL`, timeout de requisições, headers padrão e tratamento de erros HTTP.

**`types.ts`** — interfaces TypeScript de todas as entidades da API (Base, Setor, Recurso, Movimentacao, Alerta, Usuario) e enums (StatusRecurso, TipoMovimentacao, TipoUsuario).

### schemas/
Schemas Zod com as regras de validação aplicadas antes do envio à API. O usuário recebe feedback imediato sem precisar esperar resposta do servidor.

### services/
Cada service concentra todas as chamadas à API de uma entidade específica. Mapeiam as respostas HATEOAS (`_embedded`) para arrays simples prontos para uso nas telas.

### context/
**`AuthContext.tsx`** — gerencia o estado global do usuário logado usando React Context. Persiste a sessão no AsyncStorage e disponibiliza `login`, `logout` e `refreshUsuario` para qualquer tela via `useAuth()`.

### hooks/
Hooks customizados que encapsulam a lógica de carregamento — gerenciam estado de loading, erro e dados. Cada hook expõe `{ dados, isLoading, recarregar }`. Evitam duplicação de código nas telas.

### components/
Componentes visuais reutilizáveis:
- **`MyTextInput`** — campo de texto integrado ao react-hook-form com label e mensagem de erro automáticos
- **`StatusBadge`** — badge colorido por status (OK → cyan, Atenção → amarelo, Crítico → vermelho)
- **`BarraCapacidade`** — barra de progresso com cor condizente ao status do recurso
- **`CardRecurso`** — card completo com nome, setor, barra de capacidade e badge de status
- **`CardAlerta`** — card de alerta com ícone, recurso, setor e botão de resolução

### app/
Telas organizadas por file-based routing do Expo Router. Cada arquivo dentro de `app/` é uma rota navegável. Rotas dinâmicas como `recurso/[id].tsx` recebem o ID via `useLocalSearchParams` e buscam os dados correspondentes na API.

---

## Telas

| Tela | Descrição |
|---|---|
| Login | Autenticação por email |
| Cadastro | Criação de conta como Operator |
| Dashboard | Resumo geral — contadores, alertas ativos, recursos críticos, movimentações recentes |
| Recursos | Listagem com filtro por status |
| Detalhe do Recurso | Barra de capacidade, valores e histórico de movimentações |
| Nova Movimentação | Formulário de consumo ou reabastecimento |
| Editar Recurso | Formulário pré-preenchido com dados atuais |
| Movimentações | Histórico completo por base |
| Alertas | Alertas ativos com opção de resolução manual |
| Histórico | Movimentações com filtro por tipo |
| Novo Setor | Criação de setor na base do usuário |
| Editar Setor | Edição de nome e descrição |
| Perfil | Visualização e edição dos dados do usuário logado |

---

## Decisões Técnicas

**Login sem JWT** — a API não implementa autenticação via token. O login busca os usuários cadastrados e filtra pelo email informado. O objeto do usuário é salvo no AsyncStorage para manter a sessão.

**usuarioId como query param** — como não há JWT, as operações de escrita passam o `usuarioId` como query parameter. A API valida se o usuário é Operator antes de executar.

**Todos os cadastros como Operator** — o app fixa `tipoUsuario: "OPERATOR"` no service de criação de usuário. Qualquer pessoa que se cadastrar pelo app opera o sistema imediatamente.

**Zod com `z.coerce.number()`** — campos numéricos dos schemas usam `z.coerce.number()` para converter automaticamente strings (valor padrão de inputs) para números, resolvendo a incompatibilidade entre o formulário e a API.

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go instalado no celular **ou** emulador Android/iOS
- **[Storage Controller API](https://github.com/dnl-alm/Storage-Controller) rodando em `http://localhost:8080`**

> ⚠️ O aplicativo **não funciona sem a API rodando localmente**. Siga as instruções do repositório da API antes de continuar.

### 1. Clonar o repositório

```bash
git clone https://github.com/dnl-alm/Storage-Controller-App.git
cd Storage-Controller-App
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Verificar a URL da API

Confirme que `src/lib/http.ts` aponta para `http://localhost:8080`:

```typescript
const BASE_URL = "http://localhost:8080";
```

> Se estiver testando em um dispositivo físico, substitua `localhost` pelo IP da sua máquina na rede local (ex: `http://192.168.1.100:8080`).

### 4. Iniciar o app

```bash
npx expo start --clear
```

Escaneie o QR code com o Expo Go ou pressione `a` para abrir no emulador Android / `i` para iOS.

---

## Projetos Relacionados

| Projeto | Descrição |
|---|---|
| [Storage Controller API](https://github.com/dnl-alm/Storage-Controller) | API REST Java Spring Boot que alimenta este app |
