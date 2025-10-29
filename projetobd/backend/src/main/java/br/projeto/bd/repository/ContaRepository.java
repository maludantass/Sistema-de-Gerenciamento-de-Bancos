package br.projeto.bd.repository;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.projeto.bd.dto.AuditoriaContaTransacaoDTO;
import br.projeto.bd.dto.ParContasAgenciaDTO;
import br.projeto.bd.entity.Conta;

@Repository
public class ContaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Mapeia uma linha do resultado da query para um objeto Conta
    private final RowMapper<Conta> rowMapper = (rs, rowNum) -> {
        Conta conta = new Conta();
        conta.setIdConta(rs.getInt("idConta"));
        conta.setAgencia(rs.getString("agencia"));
        conta.setNumero(rs.getString("numero"));
        conta.setSaldo(rs.getBigDecimal("saldo"));
        conta.setid_Cliente(rs.getObject("id_Cliente", Integer.class));
        return conta;
    };

    /**
     * CREATE - Insere uma nova conta.
     */
    public Conta save(Conta conta) {
        String sql = "INSERT INTO Conta (idConta,agencia, numero, saldo, id_Cliente) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                conta.getIdConta(),
                conta.getAgencia(),
                conta.getNumero(), 
                conta.getSaldo(),
                conta.getid_Cliente()
        );
        return conta;
    }

    /**
     * READ - Busca todas as contas.
     */
    public List<Conta> findAll() {
        String sql = "SELECT * FROM Conta";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * READ - Busca uma conta pelo ID.
     */
    public Optional<Conta> findById(Integer id) {
        String sql = "SELECT * FROM Conta WHERE idConta = ?";
        try {
            Conta conta = jdbcTemplate.queryForObject(sql, new Object[]{id}, rowMapper);
            return Optional.ofNullable(conta);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    /**
     * UPDATE - Atualiza uma conta existente.
     */
    public int update(Conta conta) {
        String sql = "UPDATE Conta SET agencia = ?, numero = ?, saldo = ?, id_Cliente = ? WHERE idConta = ?";
        return jdbcTemplate.update(sql,
                conta.getAgencia(),
                conta.getNumero(),
                conta.getSaldo(),
                conta.getid_Cliente(),
                conta.getIdConta()
        );
    }

    /**
     * DELETE - Deleta uma conta pelo ID.
     */
    public int deleteById(Integer id) {
        String sql = "DELETE FROM Conta WHERE idConta = ?";
        return jdbcTemplate.update(sql, id);
    }

      // --- NOVAS CONSULTAS ADICIONADAS ---

    /**
     * CONSULTA COM SELF JOIN - Encontra pares de contas que pertencem à mesma agência.
     */
    public List<ParContasAgenciaDTO> findParesDeContasNaMesmaAgencia() {
        /*
         * A query une a tabela Conta com ela mesma, usando os aliases 'c1' e 'c2'.
         * A condição ON é que a agência seja a mesma.
         * A condição WHERE 'c1.idConta < c2.idConta' é crucial para:
         * 1. Evitar que uma conta seja pareada com ela mesma.
         * 2. Evitar resultados duplicados (ex: [ContaA, ContaB] e [ContaB, ContaA]).
         */
        String sql = "SELECT c1.agencia, c1.numero AS numero_conta_1, c2.numero AS numero_conta_2 " +
                     "FROM Conta c1 " +
                     "JOIN Conta c2 ON c1.agencia = c2.agencia " +
                     "WHERE c1.idConta < c2.idConta";

        // RowMapper específico para o DTO de pares de contas
        RowMapper<ParContasAgenciaDTO> dtoRowMapper = (rs, rowNum) -> {
            ParContasAgenciaDTO par = new ParContasAgenciaDTO();
            par.setAgencia(rs.getString("agencia"));
            par.setNumeroConta1(rs.getString("numero_conta_1"));
            par.setNumeroConta2(rs.getString("numero_conta_2"));
            return par;
        };

        return jdbcTemplate.query(sql, dtoRowMapper);
    }

    /**
     * CONSULTA COMPLEXA - Busca contas com saldo dentro de uma faixa de valores (min e max).
     * (Este método permanece o mesmo da resposta anterior).
     */
    public List<Conta> findBySaldoBetweenOrderBySaldoDesc(BigDecimal saldoMin, BigDecimal saldoMax) {
        String sql = "SELECT * FROM Conta WHERE saldo BETWEEN ? AND ? ORDER BY saldo DESC";
        return jdbcTemplate.query(sql, new Object[]{saldoMin, saldoMax}, rowMapper);
    }

    /**
     * CONSULTA 3: SUBCONSULTA (com IN e JOIN)
     * Objetivo: Encontrar todas as Contas que realizaram um depósito
     * acima de um valor X.
     */
    public List<Conta> findContasComDepositosAcimaDe(Connection conn, BigDecimal valorMinimo) {
        List<Conta> contas = new ArrayList<>();
        
        // A subconsulta interna junta Transacao e Deposito para
        // encontrar os 'idConta' elegíveis.
        String sql = """
            SELECT idConta, agencia, numero, saldo, id_Cliente
            FROM Conta
            WHERE idConta IN (
                SELECT T.idConta
                FROM Transacao T
                JOIN Deposito D ON T.idTransacao = D.idTransacao
                WHERE D.valor_deposito > ?
            )
            """;

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setBigDecimal(1, valorMinimo);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Conta c = new Conta(); // Supondo que você tenha um construtor
                    c.setIdConta(rs.getInt("idConta"));
                    c.setAgencia(rs.getString("agencia"));
                    c.setNumero(rs.getString("numero"));
                    c.setSaldo(rs.getBigDecimal("saldo"));
                    c.setid_Cliente(rs.getInt("id_Cliente"));
                    contas.add(c);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace(); 
        }
        return contas;
    }

    /**
     * CONSULTA 4: FULL OUTER JOIN
     * Objetivo: Criar um relatório de auditoria que mostre:
     * 1. Contas com suas transações.
     * 2. Contas que NUNCA tiveram transações (saldo inicial, por ex.)
     * 3. Transações "órfãs" (se a FK idConta puder ser NULL).
     */
    public List<AuditoriaContaTransacaoDTO> getRelatorioAuditoriaContasTransacoes(Connection conn) {
        List<AuditoriaContaTransacaoDTO> relatorio = new ArrayList<>();
        
        // FULL OUTER JOIN mostra todos os registros de AMBAS as tabelas,
        // combinando onde a condição (ON) é verdadeira.
        String sql = """
            SELECT 
                C.idConta, C.agencia, C.numero,
                T.idTransacao, T.dataHora
            FROM Conta C
            FULL OUTER JOIN Transacao T ON C.idConta = T.idConta
            ORDER BY C.idConta, T.dataHora
            """;

        try (PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                AuditoriaContaTransacaoDTO item = new AuditoriaContaTransacaoDTO();
                // Usamos getInt() e getTimestamp() que retornam 0 ou null
                // se o valor for SQL NULL
                item.setIdConta((Integer) rs.getObject("idConta")); 
                item.setAgencia(rs.getString("agencia"));
                item.setNumeroConta(rs.getString("numero"));
                item.setIdTransacao((Integer) rs.getObject("idTransacao"));
                item.setDataHoraTransacao(rs.getTimestamp("dataHora"));
                relatorio.add(item);
            }
        } catch (SQLException e) {
            e.printStackTrace(); 
        }
        return relatorio;
    }
}