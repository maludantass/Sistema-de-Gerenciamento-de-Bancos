package br.projeto.bd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.projeto.bd.entity.Conta;
import br.projeto.bd.repository.ContaRepository;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    public Conta criarConta(Conta conta) {
        // Regra de negócio: Saldo inicial não pode ser nulo
        if (conta.getSaldo() == null) {
            conta.setSaldo(java.math.BigDecimal.ZERO);
        }
        return contaRepository.save(conta);
    }

    public List<Conta> listarTodas() {
        return contaRepository.findAll();
    }

    public Optional<Conta> buscarPorId(Integer id) {
        return contaRepository.findById(id);
    }

    public Conta atualizarConta(Integer id, Conta contaDetails) {
        contaDetails.setIdConta(id);
        contaRepository.update(contaDetails);
        return contaDetails;
    }

    public void deletarConta(Integer id) {
        contaRepository.deleteById(id);
    }
}