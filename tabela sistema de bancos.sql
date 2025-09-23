CREATE DATABASE SISTEMA_BANCOS;

CREATE TABLE Banco (
    idBanco INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    CNPJ VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO Banco (idBanco, nome, CNPJ) VALUES
(1,  'Banco 1',  '00000000000001'),
(2,  'Banco 2',  '00000000000002'),
(3,  'Banco 3',  '00000000000003'),
(4,  'Banco 4',  '00000000000004'),
(5,  'Banco 5',  '00000000000005'),
(6,  'Banco 6',  '00000000000006'),
(7,  'Banco 7',  '00000000000007'),
(8,  'Banco 8',  '00000000000008'),
(9,  'Banco 9',  '00000000000009'),
(10, 'Banco 10', '00000000000010'),
(11, 'Banco 11', '00000000000011'),
(12, 'Banco 12', '00000000000012'),
(13, 'Banco 13', '00000000000013'),
(14, 'Banco 14', '00000000000014'),
(15, 'Banco 15', '00000000000015'),
(16, 'Banco 16', '00000000000016'),
(17, 'Banco 17', '00000000000017'),
(18, 'Banco 18', '00000000000018'),
(19, 'Banco 19', '00000000000019'),
(20, 'Banco 20', '00000000000020'),
(21, 'Banco 21', '00000000000021'),
(22, 'Banco 22', '00000000000022'),
(23, 'Banco 23', '00000000000023'),
(24, 'Banco 24', '00000000000024'),
(25, 'Banco 25', '00000000000025'),
(26, 'Banco 26', '00000000000026'),
(27, 'Banco 27', '00000000000027'),
(28, 'Banco 28', '00000000000028'),
(29, 'Banco 29', '00000000000029'),
(30, 'Banco 30', '00000000000030');

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

INSERT INTO Solicitacao (idSolicitacao) VALUES
(1),(2),(3),(4),(5),
(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15),
(16),(17),(18),(19),(20),
(21),(22),(23),(24),(25),
(26),(27),(28),(29),(30);

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

INSERT INTO Funcionario (idFuncionario, idBanco, nome, funcao, solicitacao, idSupervisor) VALUES
(1,  1,  'Funcionario 1',  'Gerente',    1,   NULL),
(2,  2,  'Funcionario 2',  'Atendente',  2,   1),
(3,  3,  'Funcionario 3',  'Atendente',  3,   1),
(4,  4,  'Funcionario 4',  'Atendente',  4,   1),
(5,  5,  'Funcionario 5',  'Atendente',  5,   1),
(6,  6,  'Funcionario 6',  'Gerente',    6,   NULL),
(7,  7,  'Funcionario 7',  'Atendente',  7,   6),
(8,  8,  'Funcionario 8',  'Atendente',  8,   6),
(9,  9,  'Funcionario 9',  'Atendente',  9,   6),
(10, 10, 'Funcionario 10', 'Atendente', 10,   6),
(11, 11, 'Funcionario 11', 'Gerente',   11,   NULL),
(12, 12, 'Funcionario 12', 'Atendente', 12,   11),
(13, 13, 'Funcionario 13', 'Atendente', 13,   11),
(14, 14, 'Funcionario 14', 'Atendente', 14,   11),
(15, 15, 'Funcionario 15', 'Atendente', 15,   11),
(16, 16, 'Funcionario 16', 'Gerente',   16,   NULL),
(17, 17, 'Funcionario 17', 'Atendente', 17,   16),
(18, 18, 'Funcionario 18', 'Atendente', 18,   16),
(19, 19, 'Funcionario 19', 'Atendente', 19,   16),
(20, 20, 'Funcionario 20', 'Atendente', 20,   16),
(21, 21, 'Funcionario 21', 'Gerente',   21,   NULL),
(22, 22, 'Funcionario 22', 'Atendente', 22,   21),
(23, 23, 'Funcionario 23', 'Atendente', 23,   21),
(24, 24, 'Funcionario 24', 'Atendente', 24,   21),
(25, 25, 'Funcionario 25', 'Atendente', 25,   21),
(26, 26, 'Funcionario 26', 'Gerente',   26,   NULL),
(27, 27, 'Funcionario 27', 'Atendente', 27,   26),
(28, 28, 'Funcionario 28', 'Atendente', 28,   26),
(29, 29, 'Funcionario 29', 'Atendente', 29,   26),
(30, 30, 'Funcionario 30', 'Atendente', 30,   26);

CREATE TABLE Telefone (
    Numero VARCHAR(20),
    idCliente INT,
    PRIMARY KEY (Numero, idCliente),
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    CHECK (Numero <> '') 
);

INSERT INTO Telefone (Numero, idCliente) VALUES
('(81)90001-0001', 1),
('(81)90002-0002', 2),
('(81)90003-0003', 3),
('(81)90004-0004', 4),
('(81)90005-0005', 5),
('(81)90006-0006', 6),
('(81)90007-0007', 7),
('(81)90008-0008', 8),
('(81)90009-0009', 9),
('(81)90010-0010', 10),
('(81)90011-0011', 11),
('(81)90012-0012', 12),
('(81)90013-0013', 13),
('(81)90014-0014', 14),
('(81)90015-0015', 15),
('(81)90016-0016', 16),
('(81)90017-0017', 17),
('(81)90018-0018', 18),
('(81)90019-0019', 19),
('(81)90020-0020', 20),
('(81)90021-0021', 21),
('(81)90022-0022', 22),
('(81)90023-0023', 23),
('(81)90024-0024', 24),
('(81)90025-0025', 25),
('(81)90026-0026', 26),
('(81)90027-0027', 27),
('(81)90028-0028', 28),
('(81)90029-0029', 29),
('(81)90030-0030', 30),
('(81)90031-0031', 31);

CREATE TABLE PessoaFisica (
    idCliente INT PRIMARY KEY,
    sexo CHAR(1) CHECK (sexo IN ('M','F')), 
    idade INT,
    cpf VARCHAR(15) UNIQUE NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);
INSERT INTO PessoaFisica (idCliente, sexo, idade, cpf) VALUES
(1, 'M', 19, '00000000001'),
(2, 'M', 19, '00000000002'),
(3, 'M', 19, '00000000003'),
(4, 'M', 19, '00000000004'),
(5, 'M', 19, '00000000005'),
(6, 'M', 19, '00000000006'),
(7, 'M', 20, '00000000007'),
(8, 'M', 20, '00000000008'),
(9, 'M', 20, '00000000009'),
(10,'M', 23, '00000000010'),
(11,'M', 27, '00000000011'),
(12,'M', 29, '00000000012'),
(13, 'F', 30, '00000000013'),
(14, 'F', 47, '00000000014'),
(15, 'F', 51, '00000000015'),
(16, 'F', 53, '00000000016'),
(17, 'F', 53, '00000000017'),
(18, 'F', 57, '00000000018'),
(19, 'F', 19, '00000000019'),
(20, 'F', 19, '00000000020'),
(21, 'F', 19, '00000000021'),
(22, 'F', 19, '00000000022'),
(23, 'F', 19, '00000000023'),
(24, 'F', 19, '00000000024'),
(25, 'F', 19, '00000000025'),
(26, 'F', 19, '00000000026'),
(27, 'F', 19, '00000000027'),
(28, 'F', 20, '00000000028'),
(29, 'F', 20, '00000000029'),
(30, 'F', 20, '00000000030'),
(31, 'F', 15, '00000000031');

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