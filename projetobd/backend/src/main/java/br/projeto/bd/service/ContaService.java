package br.projeto.bd.service;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource; // Import necessário

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.projeto.bd.dto.AuditoriaContaTransacaoDTO; // Import necessário
import br.projeto.bd.dto.ParContasAgenciaDTO;
import br.projeto.bd.entity.Conta;
import br.projeto.bd.exception.SolicitacaoInvalidaException;
import br.projeto.bd.repository.ContaRepository;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    @Autowired // Adicionado para gerenciar a conexão
    private DataSource dataSource; 

    public Conta criarConta(Conta conta) {
        // ... (código existente)
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

    // --- NOVOS MÉTODOS DE SERVIÇO (EXISTENTES) ---

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

    // --- NOVOS MÉTODOS DE SERVIÇO (CÓDIGO FALTANTE) ---

    /**
     * Encontra Contas que realizaram um depósito acima de um valor X.
     * Gerencia a Connection e a passa para o Repository.
     */
    public List<Conta> encontrarContasComDepositosAcimaDe(BigDecimal valorMinimo) {
        try (Connection conn = dataSource.getConnection()) {
            return contaRepository.findContasComDepositosAcimaDe(conn, valorMinimo);
        } catch (SQLException e) {
            // Em uma aplicação real, você logaria e lançaria uma exceção mais específica
            throw new RuntimeException("Erro ao buscar contas com depósitos: " + e.getMessage(), e);
        }
    }

    /**
     * Gera o relatório de auditoria de contas e transações usando FULL OUTER JOIN.
     * Gerencia a Connection e a passa para o Repository.
     */
    public List<AuditoriaContaTransacaoDTO> gerarRelatorioAuditoriaContasTransacoes() {
        try (Connection conn = dataSource.getConnection()) {
            return contaRepository.getRelatorioAuditoriaContasTransacoes(conn);
        } catch (SQLException e) {
            // Em uma aplicação real, você logaria e lançaria uma exceção mais específica
            throw new RuntimeException("Erro ao gerar relatório de auditoria: " + e.getMessage(), e);
        }
    }
}