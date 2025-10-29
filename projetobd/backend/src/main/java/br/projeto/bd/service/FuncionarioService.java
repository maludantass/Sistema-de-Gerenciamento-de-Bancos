package br.projeto.bd.service;

import java.sql.Connection; // Import necessário
import java.sql.SQLException; // Import necessário
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource; // Import necessário

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.projeto.bd.dto.FuncionarioSupervisorDTO;
import br.projeto.bd.entity.Funcionario;
import br.projeto.bd.exception.SolicitacaoInvalidaException;
import br.projeto.bd.exception.SupervisorNaoEncontradoException;
import br.projeto.bd.repository.FuncionarioRepository;

@Service
public class FuncionarioService {
    
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired // Adicionado para gerenciar a conexão JDBC nas consultas manuais
    private DataSource dataSource; 

    public Funcionario criarFuncionario(Funcionario funcionario) {
        // Validação 1: Mantemos a regra para a solicitação
        if (funcionario.getId_solicitacao() != null) {
            throw new SolicitacaoInvalidaException(
                "Não é permitido associar uma solicitação na criação do funcionário. Este campo deve ser nulo."
            );
        }

        // Validação 2: Verificamos a existência do supervisor, SE um ID for fornecido
        if (funcionario.getIdSupervisor() != null) {
            // Busca no banco se existe um funcionário com o ID do supervisor informado
            boolean supervisorExiste = funcionarioRepository.findById(funcionario.getIdSupervisor()).isPresent();
            
            // Se o método 'findById' retornar um Optional vazio, o supervisor não existe.
            if (!supervisorExiste) {
                // Lançamos nossa nova exceção específica
                throw new SupervisorNaoEncontradoException(
                    "O supervisor com o ID " + funcionario.getIdSupervisor() + " não foi encontrado no sistema."
                );
            }
        }

        // Se todas as validações passaram, podemos salvar o novo funcionário.
        return funcionarioRepository.save(funcionario);
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Optional<Funcionario> buscarPorId(Integer id) {
        return funcionarioRepository.findById(id);
    }

    public Funcionario atualizarFuncionario(Integer id, Funcionario funcionarioDetails) {
        // Garante que estamos atualizando o funcionário correto
        funcionarioDetails.setIdFuncionario(id);
        if (funcionarioDetails.getIdSupervisor() != null || funcionarioDetails.getId_solicitacao() != null) {
            throw new SolicitacaoInvalidaException(  
            "Não é permitido associar uma solicitação na criação do funcionário. Este campo deve ser nulo."
        );
        }  
        funcionarioRepository.update(funcionarioDetails);  
        return funcionarioDetails;
    }

    public void deletarFuncionario(Integer id) {
        funcionarioRepository.deleteById(id);
    }
    
    // --- MÉTODOS DE SERVIÇO EXISTENTES ---

    /**
     * Chama o repositório para listar funcionários com o nome do supervisor (SELF JOIN com JdbcTemplate).
     */
    public List<FuncionarioSupervisorDTO> listarFuncionariosComSupervisor() {
        return funcionarioRepository.findAllWithSupervisorName();
    }

    /**
     * Chama o repositório para listar todos os funcionários que são supervisores (SUBCONSULTA IN).
     */
    public List<Funcionario> listarApenasSupervisores() {
        return funcionarioRepository.findAllSupervisores();
    }
    
    // ------------------------------------------
    // --- NOVOS MÉTODOS DE SERVIÇO ADICIONADOS ---
    // ------------------------------------------

    /**
     * Encontra funcionários que não supervisionam ninguém (ANTI JOIN).
     * Gerencia a Connection e a passa para o Repository.
     */
    public List<Funcionario> encontrarNaoSupervisores() {
        try (Connection conn = dataSource.getConnection()) {
            return funcionarioRepository.findFuncionariosQueNaoSaoSupervisores(conn);
        } catch (SQLException e) {
            // Em produção, use um logger e trate/lance exceções de forma adequada.
            throw new RuntimeException("Erro ao buscar funcionários que não são supervisores: " + e.getMessage(), e);
        }
    }

    /**
     * Encontra funcionários que são supervisores (SUBCONSULTA CORRELACIONADA com EXISTS).
     * Gerencia a Connection e a passa para o Repository.
     */
    public List<Funcionario> encontrarSupervisoresPorSubconsultaCorrelacionada() {
        try (Connection conn = dataSource.getConnection()) {
            return funcionarioRepository.findAllSupervisores(conn);
        } catch (SQLException e) {
            // Em produção, use um logger e trate/lance exceções de forma adequada.
            throw new RuntimeException("Erro ao buscar supervisores por subconsulta correlacionada: " + e.getMessage(), e);
        }
    }
}