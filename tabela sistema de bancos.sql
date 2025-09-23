CREATE DATABASE SISTEMA_BANCOS;

CREATE TABLE Banco (
    idBanco INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    CNPJ VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE Cliente (
    idCliente INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    rua VARCHAR(100),
    numero VARCHAR(10),
    CEP VARCHAR(15) CHECK (LENGTH(CEP) BETWEEN 8 AND 15) 
);

CREATE TABLE Solicitacao (
    idSolicitacao INT PRIMARY KEY
);

CREATE TABLE Funcionario (
    idFuncionario INT PRIMARY KEY,
    idBanco INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    funcao VARCHAR(50) DEFAULT 'Atendente', 
    solicitacao INT,
    idSupervisor INT,
    FOREIGN KEY (idBanco) REFERENCES Banco(idBanco),
    FOREIGN KEY (solicitacao) REFERENCES Solicitacao(idSolicitacao),
    FOREIGN KEY (idSupervisor) REFERENCES Funcionario(idFuncionario)
);

CREATE TABLE Telefone (
    Numero VARCHAR(20),
    idCliente INT,
    PRIMARY KEY (Numero, idCliente),
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    CHECK (Numero <> '') 
);

CREATE TABLE PessoaFisica (
    idCliente INT PRIMARY KEY,
    sexo CHAR(1) CHECK (sexo IN ('M','F')), 
    idade INT,
    cpf VARCHAR(15) UNIQUE NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE PessoaJuridica (
    idCliente INT PRIMARY KEY,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    tipo VARCHAR(50) DEFAULT 'LTDA',
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Possui (
    codCliente INT,
    codBanco INT,
    PRIMARY KEY (codCliente, codBanco),
    FOREIGN KEY (codCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY (codBanco) REFERENCES Banco(idBanco)
);

CREATE TABLE Conta (
    idConta INT PRIMARY KEY,
    idCliente INT NOT NULL,
    agencia VARCHAR(20) NOT NULL,
    numero VARCHAR(20) UNIQUE NOT NULL,
    saldo DECIMAL(12,2) DEFAULT 0 CHECK (saldo >= 0), 
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE ContaCorrente (
    idConta INT PRIMARY KEY,
    tarifaMensal DECIMAL(10,2) DEFAULT 0 CHECK (tarifaMensal >= 0),
    FOREIGN KEY (idConta) REFERENCES Conta(idConta)
);

CREATE TABLE ContaPoupanca (
    idConta INT PRIMARY KEY,
    taxaRendimento DECIMAL(5,2) DEFAULT 0 CHECK (taxaRendimento >= 0),
    FOREIGN KEY (idConta) REFERENCES Conta(idConta)
);

CREATE TABLE Servico (
    idServico INT PRIMARY KEY,
    idCliente INT NOT NULL,
    descricao_servico VARCHAR(200),
    taxa_juros DECIMAL(5,2) CHECK (taxa_juros >= 0),
    prazo_meses INT CHECK (prazo_meses >= 0),
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Emprestimo (
    idServico INT PRIMARY KEY,
    valor_solicitado DECIMAL(12,2) CHECK (valor_solicitado > 0),
    tipo_emprestimo VARCHAR(50) NOT NULL,
    FOREIGN KEY (idServico) REFERENCES Servico(idServico)
);

CREATE TABLE Financiamento (
    idServico INT PRIMARY KEY,
    valor_entrada DECIMAL(12,2) DEFAULT 0 CHECK (valor_entrada >= 0),
    valor_bem DECIMAL(12,2) CHECK (valor_bem > 0),
    tipo_garantia VARCHAR(50),
    FOREIGN KEY (idServico) REFERENCES Servico(idServico)
);

CREATE TABLE Contrato (
    idContrato INT PRIMARY KEY,
    idServico INT NOT NULL,
    tipo_contrato VARCHAR(50),
    valor_total DECIMAL(12,2) CHECK (valor_total > 0),
    data_assinatura DATE DEFAULT (CURRENT_DATE), 
    FOREIGN KEY (idServico) REFERENCES Servico(idServico)
);

CREATE TABLE Transacao (
    idTransacao INT PRIMARY KEY,
    idCliente INT NOT NULL,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Saque (
    idTransacao INT PRIMARY KEY,
    tipo_saque VARCHAR(50),
    limite_utilizado DECIMAL(12,2) DEFAULT 0 CHECK (limite_utilizado >= 0),
    FOREIGN KEY (idTransacao) REFERENCES Transacao(idTransacao)
);

CREATE TABLE Deposito (
    idTransacao INT PRIMARY KEY,
    origem_valor VARCHAR(100),
    metodo_deposito VARCHAR(50),
    FOREIGN KEY (idTransacao) REFERENCES Transacao(idTransacao)
);

CREATE TABLE Recibo (
    idRecibo INT PRIMARY KEY,
    idTransacao INT NOT NULL,
    data_emissao DATE DEFAULT (CURRENT_DATE),
    tipo_transacao VARCHAR(50),
    valor DECIMAL(12,2) CHECK (valor > 0),
    FOREIGN KEY (idTransacao) REFERENCES Transacao(idTransacao)
);