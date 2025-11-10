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

CREATE TABLE Log_Transacoes (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    idTransacao INT,
    idConta INT,
    tipo_transacao VARCHAR(50),
    valor DECIMAL(15, 2),
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);
/* * 1. Índice em Funcionario(idSupervisor):
 * Justificativa: Essencial para acelerar as consultas de hierarquia
 * (Anti-Join e Subconsulta Correlacionada) que faremos no
 * FuncionarioRepository, pois otimiza a auto-referência
 * (F1.idFuncionario = F2.idSupervisor).
 */
 
CREATE INDEX idx_func_nome ON Funcionario(nome);


/* * 2. Índice em Transacao(idConta):
 * Justificativa: Acelera a busca de transações por conta.
 * Será usado diretamente pela subconsulta no ContaRepository
 * para encontrar contas com depósitos de alto valor.
 */
CREATE INDEX idx_conta_saldo ON Conta(saldo);

/*
Cria um "dossiê" do cliente, unificando dados cadastrais
 (Cliente), telefone (Telefone) e identificação fiscal (PessoaFisica / PessoaJuridica).
  Essencial para telas de CRM.
*/

CREATE VIEW vw_RelatorioClienteDetalhado AS
SELECT
    C.id_Cliente,
    C.nome,
    C.rua,
    C.CEP,
    T.Numero AS telefone_contato,
    PF.cpf,
    PJ.cnpj
FROM
    Cliente C
LEFT JOIN Telefone T ON C.id_Cliente = T.id_Cliente
LEFT JOIN PessoaFisica PF ON C.id_Cliente = PF.id_Cliente
LEFT JOIN PessoaJuridica PJ ON C.id_Cliente = PJ.id_Cliente;

/*voltada para "Análise de Risco". Consolida a posição financeira (Conta),
 serviços (Servico) e contratos (Contrato) de um cliente.*/

CREATE VIEW vw_PosicaoFinanceiraServicos AS
SELECT
    C.id_Cliente,
    C.nome AS nome_cliente,
    K.idConta,
    K.saldo,
    S.idServico,
    S.descricao_servico,
    CT.idContrato,
    CT.valor_total AS valor_contrato
FROM
    Cliente C
LEFT JOIN Conta K ON C.id_Cliente = K.id_Cliente
LEFT JOIN Servico S ON C.id_Cliente = S.id_Cliente
LEFT JOIN Contrato CT ON S.idServico = CT.idServico;

/*primeira função*/
DELIMITER $$

CREATE FUNCTION classifica_risco_cliente(p_id INT)
RETURNS VARCHAR(10)
READS SQL DATA
BEGIN
    DECLARE v_total_saldo DECIMAL(18,2) DEFAULT 0;
    DECLARE v_total_contrato DECIMAL(18,2) DEFAULT 0;
    DECLARE v_risco DECIMAL(18,4);

    SELECT COALESCE(SUM(saldo), 0)
      INTO v_total_saldo
      FROM Conta
     WHERE id_Cliente = p_id;

    SELECT COALESCE(SUM(CT.valor_total), 0)
      INTO v_total_contrato
      FROM Servico S
      JOIN Contrato CT ON CT.idServico = S.idServico
     WHERE S.id_Cliente = p_id;

    IF v_total_contrato = 0 THEN
        RETURN 'BAIXO';
    END IF;

    SET v_risco = v_total_saldo / v_total_contrato;

    IF v_risco >= 1.0 THEN
        RETURN 'BAIXO';
    ELSEIF v_risco >= 0.5 THEN
        RETURN 'MEDIO';
    ELSE
        RETURN 'ALTO';
    END IF;
END $$
DELIMITER ;

/*segunda função*/
DELIMITER $$

CREATE FUNCTION tipo_cliente(p_id INT)
RETURNS VARCHAR(20)
READS SQL DATA
BEGIN
    DECLARE v_pf INT DEFAULT 0;
    DECLARE v_pj INT DEFAULT 0;
    DECLARE v_tipo VARCHAR(20);

    SELECT COUNT(*) INTO v_pf
      FROM PessoaFisica
     WHERE id_Cliente = p_id;

    SELECT COUNT(*) INTO v_pj
      FROM PessoaJuridica
     WHERE id_Cliente = p_id;

    CASE
        WHEN v_pf > 0 THEN SET v_tipo = 'PESSOA FISICA';
        WHEN v_pj > 0 THEN SET v_tipo = 'PESSOA JURIDICA';
        ELSE SET v_tipo = 'NAO INFORMADO';
    END CASE;

    RETURN v_tipo;
END $$
DELIMITER ;

/*primeiro procedimento*/
DELIMITER $$

CREATE PROCEDURE atualizar_saldo_conta(
    IN p_idConta INT,
    IN p_valor DECIMAL(15,2),
    IN p_operacao VARCHAR(10)
)
BEGIN
    IF p_operacao = 'deposito' THEN
        UPDATE Conta
        SET saldo = saldo + p_valor
        WHERE idConta = p_idConta;

    ELSEIF p_operacao = 'saque' THEN
        UPDATE Conta
        SET saldo = saldo - p_valor
        WHERE idConta = p_idConta AND saldo >= p_valor;

    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Operação inválida. Use "deposito" ou "saque".';
    END IF;
END$$

DELIMITER ;

/* segundo procedimento*/
DELIMITER $$

CREATE PROCEDURE processa_juros_emprestimo()
BEGIN
    DECLARE done TINYINT DEFAULT 0;
    DECLARE v_idServico INT;
    DECLARE v_valor_solicitado DECIMAL(15, 2);
    DECLARE v_taxa_juros DECIMAL(5, 4);
    DECLARE v_id_cliente INT;
    DECLARE v_juros_mensal DECIMAL(15, 2);
    
    -- 1. DECLARE: Cursor para buscar os dados necessários para o cálculo
    DECLARE cur_emprestimos CURSOR FOR
        SELECT E.idServico, E.valor_solicitado, S.taxa_juros, S.id_Cliente
          FROM Emprestimo E
          JOIN Servico S ON E.idServico = S.idServico
         WHERE E.valor_solicitado > 0; -- Apenas empréstimos ainda ativos (com valor pendente)
        
    -- Tratamento de erro/fim de dados (para sair do loop)
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur_emprestimos;

    read_loop: LOOP
        
        -- FETCH: Lê os dados da linha atual para as variáveis
        FETCH cur_emprestimos INTO v_idServico, v_valor_solicitado, v_taxa_juros, v_id_cliente;
        
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        -- ******* LÓGICA QUE EXIGE CURSOR *******
        
        -- 1. CÁLCULO: Calcula o valor do juros (e arredonda para 2 casas)
        SET v_juros_mensal = ROUND(v_valor_solicitado * IFNULL(v_taxa_juros, 0), 2);

        -- 2. ATUALIZAÇÃO DO EMPRÉSTIMO (Subtrai o juros do valor principal)
        -- Processamento sequencial, linha a linha
        UPDATE Emprestimo
           SET valor_solicitado = GREATEST(0, valor_solicitado - v_juros_mensal)
         WHERE idServico = v_idServico;

        -- 3. CRÉDITO NA CONTA DO CLIENTE (Adiciona o valor do juros como 'renda' na primeira conta do cliente)
        -- Complexidade adicional: precisa garantir que apenas UMA conta é atualizada
        UPDATE Conta
           SET saldo = saldo + v_juros_mensal
         WHERE id_Cliente = v_id_cliente
         ORDER BY idConta
         LIMIT 1; 

        -- Note: Se fosse um 'UPDATE' baseado em SET-BASED, o cálculo e a atualização
        -- sequencial entre Emprestimo e Conta seria extremamente difícil de garantir
        -- para CADA linha de empréstimo.

    END LOOP;

    CLOSE cur_emprestimos;
    
    SELECT 'Processamento de juros de empréstimos concluído.' AS Status;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_insert_saque
AFTER INSERT
ON Saque
FOR EACH ROW
BEGIN
	DECLARE conta_id INT;  
    -- Busca a conta relacionada à transação
    SELECT idConta INTO conta_id
    FROM Transacao
    WHERE idTransacao = NEW.idTransacao;

    -- Atualiza o saldo (débito)
    UPDATE Conta
    SET saldo = saldo - NEW.valor_saque
    WHERE idConta = conta_id;

    -- Registra o log da transação
    INSERT INTO Log_Transacoes (idTransacao, idConta, tipo_transacao, valor)
    VALUES (NEW.idTransacao, conta_id, 'SAQUE', NEW.valor_saque);
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_insert_deposito
AFTER INSERT
ON Deposito
FOR EACH ROW
BEGIN
    DECLARE conta_id INT;

    -- Busca a conta relacionada à transação
    SELECT idConta INTO conta_id
    FROM Transacao
    WHERE idTransacao = NEW.idTransacao;

    -- Atualiza o saldo (crédito)
    UPDATE Conta
    SET saldo = saldo + NEW.valor_deposito
    WHERE idConta = conta_id;

    -- Registra o log da transação
    INSERT INTO Log_Transacoes (idTransacao, idConta, tipo_transacao, valor)
    VALUES (NEW.idTransacao, conta_id, 'DEPOSITO', NEW.valor_deposito);
END$$

DELIMITER ;
