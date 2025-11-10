package br.projeto.bd.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.projeto.bd.entity.Deposito;

@Repository
public class DepositoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * CREATE (POST)
     * Salva um Deposito e sua Transacao correspondente.
     */
    public Deposito salvar(Deposito deposito) {
        // Etapa 1: Inserir na tabela pai (Transacao)
        final String sqlTransacao = "INSERT INTO Transacao (idTransacao, dataHora, idConta) VALUES (?, ?, ?)";
        jdbcTemplate.update(
                sqlTransacao,
                deposito.getIdTransacao(),
                deposito.getDataHora(),
                deposito.getIdConta()
        );

        // Etapa 2: Inserir na tabela filha (Deposito)
        // CORREÇÃO: Usando snake_case (origem_valor, metodo_deposito, valor_deposito)
        final String sqlDeposito = "INSERT INTO Deposito (idTransacao, origem_valor, metodo_deposito, valor_deposito) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(
                sqlDeposito,
                deposito.getIdTransacao(),
                deposito.getOrigemValor(),
                deposito.getMetodoDeposito(),
                deposito.getValorDeposito()
        );
        return deposito;
    }

    /**
     * READ (GET)
     * Busca um Deposito fazendo JOIN com a Transacao.
     */
    public Optional<Deposito> findById(Integer id) {
        // CORREÇÃO: Usando snake_case (origem_valor, metodo_deposito, valor_deposito)
        final String sql = "SELECT t.idTransacao, t.dataHora, t.idConta, " +
                           "d.origem_valor, d.metodo_deposito, d.valor_deposito " +
                           "FROM Transacao t " +
                           "JOIN Deposito d ON t.idTransacao = d.idTransacao " +
                           "WHERE t.idTransacao = ?";
        try {
            Deposito deposito = jdbcTemplate.queryForObject(sql, new DepositoRowMapper(), id);
            return Optional.ofNullable(deposito);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // Retorna vazio se não encontrar
        }
    }

    /**
     * UPDATE (PUT)
     * Atualiza ambas as tabelas (Transacao e Deposito).
     */
    public Deposito atualizar(Deposito deposito) {
        // Etapa 1: Atualizar a tabela pai (Transacao)
        final String sqlTransacao = "UPDATE Transacao SET dataHora = ?, idConta = ? WHERE idTransacao = ?";
        jdbcTemplate.update(
                sqlTransacao,
                deposito.getDataHora(),
                deposito.getIdConta(),
                deposito.getIdTransacao()
        );

        // Etapa 2: Atualizar a tabela filha (Deposito)
        // CORREÇÃO: Usando snake_case (origem_valor, metodo_deposito, valor_deposito)
        final String sqlDeposito = "UPDATE Deposito SET origem_valor = ?, metodo_deposito = ?, valor_deposito = ? WHERE idTransacao = ?";
        jdbcTemplate.update(
                sqlDeposito,
                deposito.getOrigemValor(),
                deposito.getMetodoDeposito(),
                deposito.getValorDeposito(),
                deposito.getIdTransacao()
        );
        return deposito;
    }

    /**
     * DELETE (DELETE)
     * Deleta de ambas as tabelas (filha primeiro, depois pai).
     */
    public void deletarPorId(Integer id) {
        // Etapa 1: Deletar da tabela filha (Deposito)
        final String sqlDeposito = "DELETE FROM Deposito WHERE idTransacao = ?";
        jdbcTemplate.update(sqlDeposito, id);

        // Etapa 2: Deletar da tabela pai (Transacao)
        final String sqlTransacao = "DELETE FROM Transacao WHERE idTransacao = ?";
        jdbcTemplate.update(sqlTransacao, id);
    }

    /**
     * RowMapper interno para mapear o resultado do JOIN para um objeto Deposito.
     */
    private static class DepositoRowMapper implements RowMapper<Deposito> {
        @Override
        public Deposito mapRow(ResultSet rs, int rowNum) throws SQLException {
            Deposito deposito = new Deposito();
            
            // Dados da Transacao
            deposito.setIdTransacao(rs.getInt("idTransacao"));
            deposito.setDataHora(rs.getTimestamp("dataHora"));
            deposito.setIdConta(rs.getInt("idConta"));
            
            // Dados do Deposito
            // CORREÇÃO: Lendo de snake_case (origem_valor, metodo_deposito, valor_deposito)
            deposito.setOrigemValor(rs.getString("origem_valor"));
            deposito.setMetodoDeposito(rs.getString("metodo_deposito"));
            deposito.setValorDeposito(rs.getBigDecimal("valor_deposito"));
            
            return deposito;
        }
    }
}