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

INSERT INTO Cliente (idCliente, nome, rua, numero, CEP) VALUES
(1,  'Leonardo Almeida', 'Aldeia', '101', '50000111'),
(2,  'Maria Clara Holanda', 'Aldeia', '102', '50000112'),
(3,  'Rosélio', 'Barra de Jangada', '103', '50000113'),
(4,  'Lucas', 'Camaragibe', '104', '50000114'),
(5,  'Julia Nunes Cordeiro', 'Camaragibe', '105', '50000115'),
(6,  'Breno Tavares', 'Encruzilhada', '106', '50000116'),
(7,  'Adelia', 'Madalena', '107', '50000117'),
(8,  'Nina Zilá', 'Madalena', '108', '50000118'),
(9,  'Mariana Guimarães Coêlho', 'Monteiro', '109', '50000119'),
(10, 'Maria Luíza Dantas Tavares', 'Monteiro', '110', '50000120'),
(11, 'Henrique', 'Casa Forte', '111', '50000121'),
(12, 'Maria Regina Moraes', 'Casa Forte', '112', '50000122'),
(13, 'Julya Micaely da Silva', 'Casa Forte', '113', '50000123'),
(14, 'Marcela Coutinho Cavalcanti', 'Casa Forte', '114', '50000124'),
(15, 'Victor', 'Dois Irmãos', '115', '50000125'),
(16, 'Lídia', 'Ilha do Leite', '116', '50000126'),
(17, 'Arthur Rocha Campos', 'Poço da Panela', '117', '50000127'),
(18, 'Irvin', 'Poço da Panela', '118', '50000128'),
(19, 'Clara Amorim', 'Poço da Panela', '119', '50000129'),
(20, 'Antonio', 'Pina', '120', '50000130'),
(21, 'Maria Luiza', 'Hipódromo', '121', '50000131'),
(22, 'Guilherme', 'Rosarinho', '122', '50000132'),
(23, 'Sofia Duarte', 'Rosarinho', '123', '50000133'),
(24, 'Maria Isabel Freire Pessoa Raposo', 'Boa Viagem', '124', '50000134'),
(25, 'Isabela Lima Alves Dantas', 'Boa Viagem', '125', '50000135'),
(26, 'Bruno Feitosa', 'Boa Viagem', '126', '50000136'),
(27, 'Juliana Lima', 'Boa Viagem', '127', '50000137'),
(28, 'Luisa Martins', 'Torre', '128', '50000138'),
(29, 'Miguel Rabelo', 'Torre', '129', '50000139'),
(30, 'Fabiana', 'Monteiro', '130', '50000140'),
(31, 'Julia Maria', 'Casa Forte', '131', '50000141');

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
-- Teste de atualização no Git