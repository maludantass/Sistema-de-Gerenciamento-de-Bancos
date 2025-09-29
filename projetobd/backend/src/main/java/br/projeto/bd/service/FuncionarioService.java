package br.projeto.bd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.projeto.bd.dto.FuncionarioSupervisorDTO;
import br.projeto.bd.entity.Funcionario;
import br.projeto.bd.exception.SolicitacaoInvalidaException;
import br.projeto.bd.repository.FuncionarioRepository;

@Service
public class FuncionarioService {
  
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Funcionario criarFuncionario(Funcionario funcionario) {
        if (funcionario.getId_solicitacao() != null || funcionario.getIdSupervisor() != null ) {
            throw new SolicitacaoInvalidaException(
            "Não é permitido associar uma solicitação na criação do funcionário. Este campo deve ser nulo."
        );
        }   
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
     // --- NOVOS MÉTODOS DE SERVIÇO ---

    /**
     * Chama o repositório para listar funcionários com o nome do supervisor.
     */
    public List<FuncionarioSupervisorDTO> listarFuncionariosComSupervisor() {
        return funcionarioRepository.findAllWithSupervisorName();
    }

    /**
     * Chama o repositório para listar todos os funcionários que são supervisores.
     */
    public List<Funcionario> listarApenasSupervisores() {
        return funcionarioRepository.findAllSupervisores();
    }
}