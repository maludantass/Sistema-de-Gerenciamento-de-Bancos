# Sistema de Gerenciamento Bancário 🏦

<div align="center">

**Sistema completo de gerenciamento bancário com dashboard estatístico integrado**


![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.5-green?style=for-the-badge&logo=springboot)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

</div>

---

## 🎯 Sobre o Projeto

O **Sistema de Gerenciamento Bancário** é uma aplicação full-stack completa que simula operações bancárias reais, incluindo gestão de clientes, contas, transações (saques e depósitos), funcionários e serviços financeiros. O sistema possui integração total com banco de dados MySQL, incluindo procedures, functions, triggers, views e consultas complexas.

### ✨ Destaques

- ✅ **CRUD completo** para 4+ entidades principais
- ✅ **6 gráficos estatísticos** dinâmicos baseados em dados reais do banco
- ✅ **Dashboard interativo** com indicadores de negócio
- ✅ **Consultas SQL avançadas** (Self Join, Anti Join, Subconsultas, Full Outer Join)
- ✅ **Views SQL** para relatórios consolidados
- ✅ **Triggers automáticos** para log de transações
- ✅ **Functions e Procedures** integrados à interface

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.5** - Framework web
- **MySQL 8.0** - Banco de dados relacional
- **Maven** - Gerenciador de dependências

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Biblioteca de gráficos
- **Shadcn/UI** - Componentes de interface

### Banco de Dados
- **MySQL 8.0.33** - SGBD
- **JdbcTemplate** - Consultas SQL nativas
- **Procedures & Functions** - Lógica de negócio no DB
- **Triggers** - Automação de processos
- **Views** - Consultas pré-definidas

---

## 🚀 Instalação e Configuração

### Pré-requisitos

```bash
# Verificar versões instaladas
java --version    # Java 21 ou superior
node --version    # Node.js 18 ou superior
mysql --version   # MySQL 8.0 ou superior
```

### 1️⃣ Configuração do Banco de Dados

```sql
-- 1. Criar o banco de dados
CREATE DATABASE SISTEMA_BANCOS;
USE SISTEMA_BANCOS;

-- 2. Executar o script de criação das tabelas
-- Localização: /tabela sistema de bancos.sql
SOURCE tabela_sistema_de_bancos.sql;

-- 3. Inserir dados de exemplo
-- Localização: /inserção de dados na tabela do sistema de bancos.sql
SOURCE inserção_de_dados.sql;
```

### 2️⃣ Configuração do Backend

```bash
# Navegar para a pasta do backend
cd projetobd/backend

# Configurar credenciais do banco
# Editar: src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/SISTEMA_BANCOS
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
```

```bash
# Compilar e executar
./mvnw clean install
./mvnw spring-boot:run

# Backend estará rodando em: http://localhost:8080
```

> ⚠️ **IMPORTANTE:** Lembre-se de mudar a senha do banco de dados no `application.properties`, visto que o banco de dados é local.

### 3️⃣ Configuração do Frontend

```bash
# Navegar para a pasta do frontend
cd projetobd/frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Frontend estará rodando em: http://localhost:3000
```

### ✅ Verificação da Instalação

1. **Backend**: Acesse `http://localhost:8080/api/funcionarios` - deve retornar JSON
2. **Frontend**: Acesse `http://localhost:3000` - deve exibir o dashboard
3. **Banco de Dados**: Execute `SELECT COUNT(*) FROM Cliente;` - deve retornar 32

---

## 📁 Estrutura do Projeto

```
projetobd/
│
├── backend/                          # API REST Spring Boot
│   ├── src/main/java/br/projeto/bd/
│   │   ├── controller/              # Endpoints da API
│   │   │   ├── ContaController.java
│   │   │   ├── FuncionarioController.java
│   │   │   ├── SaqueController.java
│   │   │   └── DepositoController.java
│   │   ├── service/                 # Lógica de negócio
│   │   ├── repository/              # Acesso aos dados (SQL nativo)
│   │   ├── entity/                  # Entidades JPA
│   │   └── dto/                     # Objetos de transferência
│   └── src/main/resources/
│       └── application.properties   # ⚙️ CONFIGURAR AQUI
│
├── frontend/                         # Interface Next.js
│   ├── app/
│   │   ├── page.tsx                 # Página principal
│   │   └── globals.css              # Estilos globais
│   ├── components/
│   │   ├── dashboard-page.tsx       # 📊 DASHBOARD ESTATÍSTICO
│   │   ├── consultas-page.tsx       # 🔍 CONSULTAS E VIEWS
│   │   ├── graficos-page.tsx        # 📈 GRÁFICOS EXTERNOS
│   │   ├── funcionarios-page.tsx    # CRUD Funcionários
│   │   ├── contas-page.tsx          # CRUD Contas
│   │   ├── saques-page.tsx          # CRUD Saques
│   │   └── depositos-page.tsx       # CRUD Depósitos
│   └── package.json
│
├── tabela sistema de bancos.sql     # 🗄️ DDL (CREATE TABLE, INDEX, etc)
└── inserção de dados.sql            # 📝 DML (INSERT INTO)
```

---

## 🎯 Funcionalidades Principais

### 1. CRUD Completo (4+ Tabelas) ✅

| Entidade | Localização Frontend | Localização Backend | Operações |
|----------|---------------------|---------------------|-----------|
| **Funcionários** | `/components/funcionarios-page.tsx` | `/controller/FuncionarioController.java` | Create, Read, Update, Delete |
| **Contas** | `/components/contas-page.tsx` | `/controller/ContaController.java` | Create, Read, Update, Delete |
| **Saques** | `/components/saques-page.tsx` | `/controller/SaqueController.java` | Create, Read, Update, Delete |
| **Depósitos** | `/components/depositos-page.tsx` | `/controller/DepositoController.java` | Create, Read, Update, Delete |

**Como acessar:** Abra `http://localhost:3000` e clique nos botões do header (Funcionários, Contas, Depósitos, Saques).

---

### 2. Dashboard Estatístico (6 Gráficos) ✅

**📍 Localização:** `/components/dashboard-page.tsx`  
**🌐 Como acessar:** `http://localhost:3000` → Botão "Dashboard" (ícone TrendingUp)

#### Gráficos Implementados:

| # | Tipo | Título | Análise Estatística | Linha |
|---|------|--------|---------------------|-------|
| 1 | 📊 Barras | Visão Geral do Sistema | Distribuição de registros | 205 |
| 2 | 🥧 Pizza | Proporção de Transações | Depósitos vs Saques | 231 |
| 3 | 📈 Área | Tendências Temporais | Evolução mensal de transações | 257 |
| 4 | 🎯 Radar | Análise Multidimensional | Comparação de métricas percentuais | 296 |
| 5 | 📊 Barras | Distribuição de Saldos | Frequência por faixa de valores | 329 |
| 6 | 📉 Linha | Correlação de Transações | Relação Depósitos x Saques (semanal) | 362 |

#### Indicadores Estatísticos:

**📍 Localização:** `/components/dashboard-page.tsx` linhas 398-484

- **Medidas de Tendência Central:** Média, Mediana, Moda (saldos)
- **Medidas de Dispersão:** Variância, Desvio Padrão, Coeficiente de Variação (depósitos)
- **Percentuais e Taxas:** Taxa Depósito/Conta, Taxa Saque/Conta, Saldo/Funcionário

💾 **Dados:** Todos os gráficos e indicadores são calculados a partir dos dados reais do banco de dados MySQL via API.

---

### 3. Consultas SQL Avançadas ✅

**📍 Localização Frontend:** `/components/consultas-page.tsx`  
**📍 Localização Backend:** `/repository/FuncionarioRepository.java` e `/repository/ContaRepository.java`  
**🌐 Como acessar:** `http://localhost:3000` → Botão "Consultas" (ícone Search)

| # | Tipo de Consulta | Descrição | Localização Backend | Endpoint | Linha |
|---|------------------|-----------|---------------------|----------|-------|
| 1 | **Self Join** | Funcionários com seus supervisores | `FuncionarioRepository.java` | `GET /api/funcionarios/com-supervisor` | 66 |
| 2 | **Anti Join** | Funcionários que NÃO são supervisores | `FuncionarioRepository.java` | `GET /api/funcionarios/nao-supervisores` | 116 |
| 3 | **Subconsulta (IN)** | Apenas supervisores | `FuncionarioRepository.java` | `GET /api/funcionarios/supervisores` | 85 |
| 4 | **Subconsulta Correlacionada (EXISTS)** | Supervisores (via EXISTS) | `FuncionarioRepository.java` | `GET /api/funcionarios/supervisores-exists` | 143 |
| 5 | **Subconsulta (Depósitos Altos)** | Contas com depósitos > valor X | `ContaRepository.java` | `GET /api/contas/depositos-acima/{valor}` | 127 |
| 6 | **Full Outer Join** | Auditoria de Contas x Transações | `ContaRepository.java` | `GET /api/contas/relatorio-auditoria` | 162 |

**Como usar:**
1. Acesse a aba "Consultas"
2. Clique nos botões: "Auditoria", "Depósitos Altos" ou "Posição Financeira"
3. Para depósitos altos, insira um valor mínimo (ex: 500) e clique "Buscar"

---

### 4. Views SQL ✅

**📍 Localização SQL:** `/tabela sistema de bancos.sql` linhas 176-216  
**📍 Localização Backend:**
- `/controller/ContaController.java:108` (método `getPosicaoFinanceira`)
- `/controller/PosicaoFinanceiraDTO.java`

**🌐 Como acessar:** `http://localhost:3000` → Consultas → Botão "Posição Financeira" (roxo)

| View | Propósito | Localização SQL | Endpoint |
|------|-----------|-----------------|----------|
| `vw_RelatorioClienteDetalhado` | Dossiê completo do cliente (dados + telefone + CPF/CNPJ) | Linha 176 | (não exposto na interface) |
| `vw_PosicaoFinanceiraServicos` | Consolidação Clientes + Contas + Serviços + Contratos | Linha 190 | `GET /api/contas/view/posicao-financeira` |

**Campos retornados pela View:**
- `id_Cliente`, `nome_cliente`
- `idConta`, `saldo`
- `idServico`, `descricao_servico`
- `idContrato`, `valor_contrato`

---

### 5. Funções SQL ✅

**📍 Localização SQL:** `/tabela sistema de bancos.sql` linhas 218-287

| Função | Propósito | Localização | Como Testar |
|--------|-----------|-------------|-------------|
| `classifica_risco_cliente(id)` | Retorna 'BAIXO', 'MEDIO' ou 'ALTO' baseado na relação Saldo/Contratos | Linha 220 | `SELECT classifica_risco_cliente(1);` |
| `tipo_cliente(id)` | Retorna 'PESSOA FISICA', 'PESSOA JURIDICA' ou 'NAO INFORMADO' | Linha 256 | `SELECT tipo_cliente(1);` |

**Teste no MySQL Workbench:**

```sql
-- Classificar risco do cliente 1
SELECT 
    id_Cliente,
    nome,
    classifica_risco_cliente(id_Cliente) AS risco,
    tipo_cliente(id_Cliente) AS tipo
FROM Cliente
WHERE id_Cliente = 1;
```

---

### 6. Procedimentos SQL ✅

**📍 Localização SQL:** `/tabela sistema de bancos.sql` linhas 289-370

| Procedure | Propósito | Localização | Como Executar |
|-----------|-----------|-------------|---------------|
| `atualizar_saldo_conta` | Adiciona/subtrai saldo (manual) | Linha 291 | `CALL atualizar_saldo_conta(1, 100.00, 'deposito');` |
| `processa_juros_emprestimo` | Aplica juros mensais em empréstimos (usando CURSOR) | Linha 313 | `CALL processa_juros_emprestimo();` |

**Exemplo de uso:**

```sql
-- Adicionar R$ 100 na conta 1
CALL atualizar_saldo_conta(1, 100.00, 'deposito');

-- Processar juros de todos os empréstimos
CALL processa_juros_emprestimo();
```

---

### 7. Triggers ✅

**📍 Localização SQL:** `/tabela sistema de bancos.sql` linhas 372-424

**🔥 Funcionamento:** Disparam **automaticamente** quando você cria um Saque ou Depósito pela interface!

| Trigger | Evento | Ação | Localização |
|---------|--------|------|-------------|
| **after_insert_saque** | Após inserir em `Saque` | 1. Debita saldo da conta<br>2. Registra em `Log_Transacoes` | Linha 373 |
| **after_insert_deposito** | Após inserir em `Deposito` | 1. Credita saldo da conta<br>2. Registra em `Log_Transacoes` | Linha 398 |

**Como visualizar os efeitos:**

1. **Via Interface:**
   - Vá em "Depósitos" → Crie um depósito de R$ 1.000,00
   - Vá em "Contas" → Veja o saldo atualizado automaticamente

2. **Via SQL:**
```sql
-- Ver logs de transações gerados pelos triggers
SELECT * FROM Log_Transacoes ORDER BY data_registro DESC LIMIT 10;
```

---

## 📊 Localização das Entregas

### 📌 Checklist de Entrega

| Item | Requisito | Localização | Status |
|------|-----------|-------------|--------|
| ✅ | **CRUD de 4+ tabelas** | `/components/*-page.tsx` + `/controller/*Controller.java` | ✔️ |
| ✅ | **Funções SQL** (2) | `/tabela sistema de bancos.sql:220,256` | ✔️ |
| ✅ | **Procedures** (2) | `/tabela sistema de bancos.sql:291,313` | ✔️ |
| ✅ | **Triggers** (2) | `/tabela sistema de bancos.sql:373,398` | ✔️ |
| ✅ | **Consultas Avançadas** (6) | `/repository/FuncionarioRepository.java` + `ContaRepository.java` | ✔️ |
| ✅ | **Views SQL** (2) | `/tabela sistema de bancos.sql:176,190` | ✔️ |
| ✅ | **Dashboard Estatístico** | `/components/dashboard-page.tsx` | ✔️ |
| ✅ | **6 Gráficos Dinâmicos** | `/components/dashboard-page.tsx:205-395` | ✔️ |
| ✅ | **Indicadores Estatísticos** | `/components/dashboard-page.tsx:398-484` | ✔️ |

---

## 🎮 Como Usar o Sistema

### Fluxo Básico de Uso

#### 1️⃣ **Dashboard** (Página Inicial)

1. Acesse `http://localhost:3000`
2. Visualize:
   - Total de funcionários, contas, depósitos e saques
   - Saldo total consolidado
   - 6 gráficos estatísticos interativos
   - Indicadores de média, mediana, variância, etc.

#### 2️⃣ **Gerenciar Funcionários**

1. Clique em "Funcionários" no header
2. Veja a lista completa ou use filtros:
   - "Todos os Funcionários"
   - "Com Supervisor" (Self Join)
   - "Apenas Supervisores" (Subconsulta)
   - Busca por ID
3. Clique "+ Novo Funcionário" para adicionar
4. Use "Editar" ou "Excluir" para modificar

#### 3️⃣ **Gerenciar Contas**

1. Clique em "Contas" no header
2. Use filtros avançados:
   - "Todas as Contas"
   - "Pares por Agência" (Self Join)
   - "Buscar por Saldo" (informe min/max)
   - Busca individual por ID ou número
3. O saldo é atualizado automaticamente pelos triggers!

#### 4️⃣ **Criar Transações**

**Depósito:**
1. Clique em "Depósitos" → "+ Novo Depósito"
2. Preencha: ID Transação, Valor, Data/Hora, ID Conta
3. Ao salvar, o trigger:
   - Adiciona o valor na conta
   - Registra em `Log_Transacoes`

**Saque:**
1. Clique em "Saques" → "+ Novo Saque"
2. Preencha: ID Transação, Valor, Data/Hora, ID Conta
3. Ao salvar, o trigger:
   - Debita o valor da conta
   - Registra em `Log_Transacoes`

#### 5️⃣ **Consultas Especiais**

1. Clique em "Consultas"
2. Escolha:
   - "Auditoria" → Full Outer Join de contas e transações
   - "Depósitos Altos" → Insira valor mínimo (ex: 500)
   - "Posição Financeira" → View SQL consolidada
3. Resultados aparecem em tabela formatada

#### 6️⃣ **Gráficos Externos**

1. Clique em "Gráficos"
2. Veja gráficos de análises de pesquisas de campo
3. Clique em qualquer gráfico para visualizar em tela cheia

---

## 🧪 Testando Funções e Procedures

### No MySQL Workbench

```sql
-- 1. Testar função de risco
SELECT 
    C.nome,
    classifica_risco_cliente(C.id_Cliente) AS nivel_risco,
    tipo_cliente(C.id_Cliente) AS tipo
FROM Cliente C
LIMIT 5;

-- 2. Testar procedure de atualização de saldo
CALL atualizar_saldo_conta(1, 500.00, 'deposito');
SELECT idConta, saldo FROM Conta WHERE idConta = 1;

-- 3. Ver logs gerados pelos triggers
SELECT * FROM Log_Transacoes ORDER BY data_registro DESC LIMIT 10;

-- 4. Processar juros de empréstimos
CALL processa_juros_emprestimo();

-- 5. Consultar View
SELECT * FROM vw_PosicaoFinanceiraServicos 
WHERE id_Cliente = 1;
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### ❌ Erro: "Connection refused" (Backend)

```bash
# Solução: Verificar se o MySQL está rodando
sudo systemctl status mysql  # Linux
# ou
mysql.server status  # macOS

# Verificar credenciais em application.properties
```

#### ❌ Erro: "404 Not Found" ao acessar API

```bash
# Solução: Certificar que o backend está rodando
cd projetobd/backend
./mvnw spring-boot:run

# Backend deve estar em http://localhost:8080
```

#### ❌ Gráficos não carregam

```bash
# Solução: Verificar se há dados no banco
mysql -u root -p SISTEMA_BANCOS
```

```sql
SELECT COUNT(*) FROM Cliente;  # Deve retornar 32
SELECT COUNT(*) FROM Conta;    # Deve retornar 61
```

#### ❌ Triggers não funcionam

```sql
-- Solução: Verificar se os triggers existem
SHOW TRIGGERS;

-- Se não existirem, executar novamente:
SOURCE tabela_sistema_de_bancos.sql;
```

---

## 📈 Análises Estatísticas Implementadas

### Medidas de Tendência Central
- **Média:** Saldo médio das contas, valor médio de depósitos/saques
- **Mediana:** Valor central dos saldos ordenados
- **Moda:** Faixa de saldo mais frequente (arredondada)

### Medidas de Dispersão
- **Variância:** Dispersão dos valores de depósito em relação à média
- **Desvio Padrão:** Raiz quadrada da variância (mesma unidade dos dados)
- **Coeficiente de Variação:** (Desvio Padrão / Média) × 100%

### Distribuições e Frequências
- **Histograma de Saldos:** Agrupamento em faixas (0-1K, 1K-3K, 3K-5K, 5K+)
- **Distribuição de Depósitos:** Frequência por valor (0-500, 500-800, 800-1000, 1000+)

### Correlações e Tendências
- **Tendências Temporais:** Evolução mensal de depósitos vs saques
- **Correlação Semanal:** Relação entre volumes de depósitos e saques

---

<div align="center">

### ⭐ Sistema de Gerenciamento Bancário - 2025 ⭐

**Desenvolvido com ❤️ usando Java, Spring Boot, Next.js e MySQL**

[🔝 Voltar ao topo](#sistema-de-gerenciamento-bancário-)

</div>
