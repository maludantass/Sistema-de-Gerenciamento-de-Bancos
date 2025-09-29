package br.projeto.bd.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

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
        String sql = "INSERT INTO Conta (agencia, numero, saldo, id_Cliente) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
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
}