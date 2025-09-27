package br.projeto.bd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.projeto.bd.entity.Funcionario;
import br.projeto.bd.repository.FuncionarioRepository;

@Service
public class FuncionarioService {
  
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Funcionario criarFuncionario(Funcionario funcionario) {
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
        funcionarioRepository.update(funcionarioDetails);
        return funcionarioDetails;
    }

    public void deletarFuncionario(Integer id) {
        funcionarioRepository.deleteById(id);
    }
}