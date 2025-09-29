package br.projeto.bd.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.projeto.bd.dto.ParContasAgenciaDTO;
import br.projeto.bd.entity.Conta;
import br.projeto.bd.exception.SolicitacaoInvalidaException;
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
        if (conta.getid_Cliente() != null) {
            throw new SolicitacaoInvalidaException(
            "Não é permitido associar uma solicitação na criação do funcionário. Este campo deve ser nulo."
        );
          
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
        if (contaDetails.getid_Cliente() != null) {
            throw new SolicitacaoInvalidaException(
            "Não é permitido associar uma solicitação na criação do funcionário. Este campo deve ser nulo."
        );
            
        }
        contaRepository.update(contaDetails);
        return contaDetails;
    }

    public void deletarConta(Integer id) {
        contaRepository.deleteById(id);
    }

     // --- NOVOS MÉTODOS DE SERVIÇO ---

    /**
     * Chama o repositório para encontrar pares de contas na mesma agência.
     */
    public List<ParContasAgenciaDTO> encontrarParesDeContasPorAgencia() {
        return contaRepository.findParesDeContasNaMesmaAgencia();
    }
    
    /**
     * Chama o repositório para buscar contas por faixa de saldo.
     */
    public List<Conta> buscarContasPorFaixaDeSaldo(BigDecimal saldoMin, BigDecimal saldoMax) {
        return contaRepository.findBySaldoBetweenOrderBySaldoDesc(saldoMin, saldoMax);
    }
}