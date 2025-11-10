package br.projeto.bd.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.projeto.bd.entity.Saque;

@Repository
public class SaqueRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * CREATE (POST)
     * Salva um Saque e sua Transacao correspondente.
     */
    public Saque salvar(Saque saque) {
        // Etapa 1: Inserir na tabela pai (Transacao)
        final String sqlTransacao = "INSERT INTO Transacao (idTransacao, dataHora, idConta) VALUES (?, ?, ?)";
        jdbcTemplate.update(
                sqlTransacao,
                saque.getIdTransacao(),
                saque.getDataHora(),
                saque.getIdConta()
        );

        // Etapa 2: Inserir na tabela filha (Saque)
        final String sqlSaque = "INSERT INTO Saque (idTransacao, tipo_saque, limite_utilizado, valor_saque) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(
                sqlSaque,
                saque.getIdTransacao(),
                saque.getTipoSaque(),
                saque.getLimiteUtilizado(),
                saque.getValorSaque()
        );
        return saque;
    }

    /**
     * READ (GET)
     * Busca um Saque fazendo JOIN com a Transacao.
     */
    public Optional<Saque> findById(Integer id) {
        final String sql = "SELECT t.idTransacao, t.dataHora, t.idConta, " +
                           "s.tipo_saque, s.limite_utilizado, s.valor_saque " +
                           "FROM Transacao t " +
                           "JOIN Saque s ON t.idTransacao = s.idTransacao " +
                           "WHERE t.idTransacao = ?";
        try {
            Saque saque = jdbcTemplate.queryForObject(sql, new SaqueRowMapper(), id);
            return Optional.ofNullable(saque);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // Retorna vazio se não encontrar
        }
    }

    /**
     * UPDATE (PUT)
     * Atualiza ambas as tabelas (Transacao e Saque).
     */
    public Saque atualizar(Saque saque) {
        // Etapa 1: Atualizar a tabela pai (Transacao)
        final String sqlTransacao = "UPDATE Transacao SET dataHora = ?, idConta = ? WHERE idTransacao = ?";
        jdbcTemplate.update(
                sqlTransacao,
                saque.getDataHora(),
                saque.getIdConta(),
                saque.getIdTransacao()
        );

        // Etapa 2: Atualizar a tabela filha (Saque)
        final String sqlSaque = "UPDATE Saque SET tipo_saque = ?, limite_utilizado = ?, valor_saque = ? WHERE idTransacao = ?";
        jdbcTemplate.update(
                sqlSaque,
                saque.getTipoSaque(),
                saque.getLimiteUtilizado(),
                saque.getValorSaque(),
                saque.getIdTransacao()
        );
        return saque;
    }

    /**
     * DELETE (DELETE)
     * Deleta de ambas as tabelas (filha primeiro, depois pai).
     */
    public void deletarPorId(Integer id) {
        // Etapa 1: Deletar da tabela filha (Saque)
        // (A restrição FOREIGN KEY exige que a filha seja deletada primeiro)
        final String sqlSaque = "DELETE FROM Saque WHERE idTransacao = ?";
        jdbcTemplate.update(sqlSaque, id);

        // Etapa 2: Deletar da tabela pai (Transacao)
        final String sqlTransacao = "DELETE FROM Transacao WHERE idTransacao = ?";
        jdbcTemplate.update(sqlTransacao, id);
    }

    /**
     * RowMapper interno para mapear o resultado do JOIN para um objeto Saque.
     */
    private static class SaqueRowMapper implements RowMapper<Saque> {
        @Override
        public Saque mapRow(ResultSet rs, int rowNum) throws SQLException {
            Saque saque = new Saque();
            
            // Dados da Transacao
            saque.setIdTransacao(rs.getInt("idTransacao"));
            saque.setDataHora(rs.getTimestamp("dataHora"));
            saque.setIdConta(rs.getInt("idConta"));
            
            // Dados do Saque
            saque.setTipoSaque(rs.getString("tipo_saque"));
            saque.setLimiteUtilizado(rs.getBigDecimal("limite_utilizado"));
            saque.setValorSaque(rs.getBigDecimal("valor_saque"));
            
            return saque;
        }
    }
}