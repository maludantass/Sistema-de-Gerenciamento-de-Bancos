package br.projeto.bd.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

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
}