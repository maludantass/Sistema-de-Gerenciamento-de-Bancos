CREATE DATABASE SISTEMA_BANCOS;
USE SISTEMA_BANCOS;


CREATE TABLE Solicitacao (
    id_solicitacao INT PRIMARY KEY 
);

CREATE TABLE Funcionario (
    idFuncionario INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    funcao VARCHAR(100),
    id_solicitacao INT,
    idSupervisor INT,
    FOREIGN KEY (id_solicitacao) REFERENCES Solicitacao(id_solicitacao) ON DELETE SET NULL,
    FOREIGN KEY (idSupervisor) REFERENCES Funcionario(idFuncionario)
);

CREATE TABLE Cliente (
    id_Cliente INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    rua VARCHAR(255),
    numero VARCHAR(20),
    CEP VARCHAR(9)
);


CREATE TABLE Pesquisa (
    idPesquisa INT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    id_respondente INT,
    FOREIGN KEY (id_respondente) REFERENCES Cliente(id_Cliente) ON DELETE SET NULL
);


CREATE TABLE Pergunta (
    idPergunta INT PRIMARY KEY,
    texto TEXT NOT NULL,
    resposta TEXT
);


CREATE TABLE Contem (
    idPesquisa INT,
    idPergunta INT,
    PRIMARY KEY (idPesquisa, idPergunta),
    FOREIGN KEY (idPesquisa) REFERENCES Pesquisa(idPesquisa),
    FOREIGN KEY (idPergunta) REFERENCES Pergunta(idPergunta)
);


CREATE TABLE Telefone (
    Numero VARCHAR(20) PRIMARY KEY,
    id_Cliente INT,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente)
);


CREATE TABLE PessoaFisica (
    id_Cliente INT PRIMARY KEY,
    sexo CHAR(1),
    idade INT,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente),
    CHECK (sexo IN ('M', 'F', 'O'))
);


CREATE TABLE PessoaJuridica (
    id_Cliente INT PRIMARY KEY,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    tipo VARCHAR(50),
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente)
);


CREATE TABLE Conta (
    idConta INT PRIMARY KEY,
    agencia VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    saldo DECIMAL(15, 2) DEFAULT 0.00,
    id_Cliente INT,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente),
    UNIQUE (agencia, numero),
    CHECK (saldo >= 0)
);


CREATE TABLE Conta_corrente (
    idConta INT PRIMARY KEY,
    tarifaMensal DECIMAL(10, 2),
    FOREIGN KEY (idConta) REFERENCES Conta(idConta) ON UPDATE CASCADE
);


CREATE TABLE Conta_poupanca (
    idConta INT PRIMARY KEY,
    taxaRendimento DECIMAL(5, 4),
    FOREIGN KEY (idConta) REFERENCES Conta(idConta),
    CHECK (taxaRendimento > 0)
);


CREATE TABLE Servico (
    idServico INT PRIMARY KEY,
    descricao_servico TEXT,
    taxa_juros DECIMAL(5, 4),
    prazo_meses INT,
    id_Cliente INT,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente)
);


CREATE TABLE Emprestimo (
    idServico INT PRIMARY KEY,
    valor_solicitado DECIMAL(15, 2) NOT NULL,
    tipo_emprestimo VARCHAR(50),
    FOREIGN KEY (idServico) REFERENCES Servico(idServico)
);


CREATE TABLE Financiamento (
    idServico INT PRIMARY KEY,
    valor_entrada DECIMAL(15, 2),
    valor_bem DECIMAL(15, 2) NOT NULL,
    tipo_garantia VARCHAR(100),
    FOREIGN KEY (idServico) REFERENCES Servico(idServico)
);


CREATE TABLE Contrato (
    idContrato INT PRIMARY KEY,
    tipo_contrato VARCHAR(100),
    valor_total DECIMAL(15, 2) NOT NULL,
    data_assinatura DATE,
    idServico INT,
    FOREIGN KEY (idServico) REFERENCES Servico(idServico)
);


CREATE TABLE Transacao (
    idTransacao INT PRIMARY KEY,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    idConta INT,
    FOREIGN KEY (idConta) REFERENCES Conta(idConta)
);


CREATE TABLE Saque (
    idTransacao INT PRIMARY KEY,
    tipo_saque VARCHAR(50),
    limite_utilizado DECIMAL(10, 2),
    valor_saque DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (idTransacao) REFERENCES Transacao(idTransacao),
    CHECK (valor_saque > 0)
);


CREATE TABLE Deposito (
    idTransacao INT PRIMARY KEY,
    origem_valor VARCHAR(255),
    metodo_deposito VARCHAR(50),
    valor_deposito DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (idTransacao) REFERENCES Transacao(idTransacao)
);


CREATE TABLE Recibo (
    idRecibo INT PRIMARY KEY,
    data_emissao DATE NOT NULL,
    tipo_transacao VARCHAR(100),
    valor_recibo DECIMAL(15, 2) NOT NULL,
    idTransacao INT,
    FOREIGN KEY (idTransacao) REFERENCES Transacao(idTransacao));
