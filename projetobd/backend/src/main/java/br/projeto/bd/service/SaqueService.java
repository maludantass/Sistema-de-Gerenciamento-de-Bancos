package br.projeto.bd.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.projeto.bd.dto.SaqueRequestDTO;
import br.projeto.bd.entity.Saque;
import br.projeto.bd.repository.SaqueRepository;

@Service
public class SaqueService {

    @Autowired
    private SaqueRepository saqueRepository;

    /**
     * CREATE
     * @Transactional garante que ambas as inserções (Transacao e Saque)
     * ocorram com sucesso, ou nenhuma delas (rollback).
     */
    @Transactional
    public Saque realizarSaque(SaqueRequestDTO dto) {
        Saque saque = mapearDtoParaSaque(dto);
        // O ID da transação é definido a partir do DTO
        saque.setIdTransacao(dto.getIdTransacao());
        return saqueRepository.salvar(saque);
    }

    @Transactional(readOnly = true)
    public List<Saque> listarTodosSaques() {
        return saqueRepository.findAll();
    }
    /**
     * READ
     * Busca um Saque pelo ID.
     */
    @Transactional(readOnly = true) // Opcional para GET, mas boa prática
    public Saque obterSaquePorId(Integer id) {
        // O repositório agora retorna um Optional
        return saqueRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Saque não encontrado com o ID: " + id));
    }

    /**
     * UPDATE
     * @Transactional é obrigatório para garantir a atomicidade dos dois UPDATEs.
     */
    @Transactional
    public Saque atualizarSaque(Integer id, SaqueRequestDTO dto) {
        // 1. Verifica se o Saque existe
        obterSaquePorId(id); // Se não existir, lança Exceção

        // 2. Mapeia o DTO
        Saque saqueParaAtualizar = mapearDtoParaSaque(dto);
        
        // 3. Garante que o ID da URL seja usado (padrão REST)
        saqueParaAtualizar.setIdTransacao(id);

        // 4. Salva no repositório
        return saqueRepository.atualizar(saqueParaAtualizar);
    }

    /**
     * DELETE
     * @Transactional é obrigatório para garantir a atomicidade dos dois DELETEs.
     */
    @Transactional
    public void deletarSaque(Integer id) {
        // 1. Verifica se o Saque existe
        obterSaquePorId(id); // Se não existir, lança Exceção

        // 2. Manda deletar
        saqueRepository.deletarPorId(id);
    }

    // --- Método Utilitário ---

    /**
     * Mapeia o DTO para a entidade Saque, validando a data.
     */
    private Saque mapearDtoParaSaque(SaqueRequestDTO dto) {
        Saque saque = new Saque();

        // Dados da superclasse Transacao
        saque.setIdConta(dto.getIdConta());

        try {
            saque.setDataHora(Timestamp.valueOf(dto.getDataHora()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de dataHora inválido. Use 'YYYY-MM-DD HH:MM:SS'.", e);
        }

        // Dados da classe Saque
        saque.setTipoSaque(dto.getTipoSaque());
        saque.setLimiteUtilizado(dto.getLimiteUtilizado());
        saque.setValorSaque(dto.getValorSaque());

        return saque;
    }
}