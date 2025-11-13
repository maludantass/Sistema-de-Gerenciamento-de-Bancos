package br.projeto.bd.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.projeto.bd.dto.DepositoRequestDTO;
import br.projeto.bd.entity.Deposito;
import br.projeto.bd.repository.DepositoRepository;

@Service
public class DepositoService {

    @Autowired
    private DepositoRepository depositoRepository;

    /**
     * CREATE (POST)
     * @Transactional garante atomicidade.
     */
    @Transactional
    public Deposito realizarDeposito(DepositoRequestDTO dto) {
        Deposito deposito = mapearDtoParaDeposito(dto);
        // O ID é definido a partir do DTO (entrada manual)
        deposito.setIdTransacao(dto.getIdTransacao());
        return depositoRepository.salvar(deposito);
    }

    public List<Deposito> listarTodosDepositos() {
        return depositoRepository.findAll();
    }
    /**
     * READ (GET)
     */
    @Transactional(readOnly = true)
    public Deposito obterDepositoPorId(Integer id) {
        return depositoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Depósito não encontrado com o ID: " + id));
    }

    /**
     * UPDATE (PUT)
     * @Transactional garante atomicidade.
     */
    @Transactional
    public Deposito atualizarDeposito(Integer id, DepositoRequestDTO dto) {
        // 1. Verifica se existe
        obterDepositoPorId(id); 

        // 2. Mapeia DTO
        Deposito depositoParaAtualizar = mapearDtoParaDeposito(dto);
        
        // 3. Garante o ID da URL
        depositoParaAtualizar.setIdTransacao(id);

        // 4. Salva no repositório
        return depositoRepository.atualizar(depositoParaAtualizar);
    }

    /**
     * DELETE (DELETE)
     * @Transactional garante atomicidade.
     */
    @Transactional
    public void deletarDeposito(Integer id) {
        // 1. Verifica se existe
        obterDepositoPorId(id); 

        // 2. Manda deletar
        depositoRepository.deletarPorId(id);
    }

    // --- Método Utilitário ---

    /**
     * Mapeia o DTO para a entidade Deposito, validando a data.
     */
    private Deposito mapearDtoParaDeposito(DepositoRequestDTO dto) {
        Deposito deposito = new Deposito();

        // Dados da superclasse Transacao
        deposito.setIdConta(dto.getIdConta());

        try {
            deposito.setDataHora(Timestamp.valueOf(dto.getDataHora()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de dataHora inválido. Use 'YYYY-MM-DD HH:MM:SS'.", e);
        }

        // Dados da classe Deposito
        deposito.setOrigemValor(dto.getOrigemValor());
        deposito.setMetodoDeposito(dto.getMetodoDeposito());
        deposito.setValorDeposito(dto.getValorDeposito());

        return deposito;
    }
}