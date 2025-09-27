package br.projeto.bd.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.projeto.bd.entity.Funcionario;

@Repository
public class FuncionarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper para mapear o resultado do banco de dados para um objeto Funcionario
    private final RowMapper<Funcionario> rowMapper = (rs, rowNum) -> {
        Funcionario funcionario = new Funcionario();
        funcionario.setIdFuncionario(rs.getInt("idFuncionario"));
        funcionario.setNome(rs.getString("nome"));
        funcionario.setFuncao(rs.getString("funcao"));
        // Trata colunas que podem ser nulas
        funcionario.setId_solicitacao(rs.getObject("id_solicitacao", Integer.class));
        funcionario.setIdSupervisor(rs.getObject("idSupervisor", Integer.class));
        return funcionario;
    };
  
    /**
     * CREATE - Insere um novo funcionário no banco de dados.
     */
    public Funcionario save(Funcionario funcionario) {
        String sql = "INSERT INTO Funcionario (nome, funcao, id_solicitacao, idSupervisor) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, 
            funcionario.getNome(), 
            funcionario.getFuncao(), 
            funcionario.getId_solicitacao(), 
            funcionario.getIdSupervisor()
        );
        // Nota: Com JDBC puro, para retornar o objeto com o ID gerado, seria necessário um passo adicional.
        // Para simplificar este exemplo, não retornamos o ID aqui.
        return funcionario;
    }

    /**
     * READ - Busca todos os funcionários.
     */
    public List<Funcionario> findAll() {
        String sql = "SELECT * FROM Funcionario";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * READ - Busca um funcionário pelo ID.
     */
    public Optional<Funcionario> findById(Integer id) {
        String sql = "SELECT * FROM Funcionario WHERE idFuncionario = ?";
        try {
            Funcionario funcionario = jdbcTemplate.queryForObject(sql, new Object[]{id}, rowMapper);
            return Optional.ofNullable(funcionario);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    /**
     * UPDATE - Atualiza um funcionário existente.
     */
    public int update(Funcionario funcionario) {
        String sql = "UPDATE Funcionario SET nome = ?, funcao = ?, id_solicitacao = ?, idSupervisor = ? WHERE idFuncionario = ?";
        return jdbcTemplate.update(sql,
            funcionario.getNome(),
            funcionario.getFuncao(),
            funcionario.getId_solicitacao(),
            funcionario.getIdSupervisor(),
            funcionario.getIdFuncionario()
        );
    }

    /**
     * DELETE - Deleta um funcionário pelo ID.
     */
    public int deleteById(Integer id) {
        String sql = "DELETE FROM Funcionario WHERE idFuncionario = ?";
        return jdbcTemplate.update(sql, id);
    }
}