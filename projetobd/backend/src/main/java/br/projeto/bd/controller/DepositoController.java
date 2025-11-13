package br.projeto.bd.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.projeto.bd.dto.DepositoRequestDTO;
import br.projeto.bd.entity.Deposito;
import br.projeto.bd.service.DepositoService;

@RestController
@RequestMapping("/api/depositos") // Rota base para depósitos
public class DepositoController {

    @Autowired
    private DepositoService depositoService;

    /**
     * POST: Cria um novo Deposito (e Transacao).
     */
    @PostMapping
    public ResponseEntity<?> criarDeposito(@RequestBody DepositoRequestDTO dto) {
        try {
            Deposito novoDeposito = depositoService.realizarDeposito(dto);
            return new ResponseEntity<>(novoDeposito, HttpStatus.CREATED);
        
        } catch (IllegalArgumentException e) {
            // Erro no formato da data ou validação do DTO
            return new ResponseEntity<>("Requisição inválida: " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
        
        } catch (DuplicateKeyException e) {
            // O idTransacao REALMENTE já existe
            return new ResponseEntity<>("Conflito: O idTransacao " + dto.getIdTransacao() + " já existe.", HttpStatus.CONFLICT); // 409
        
        } catch (DataIntegrityViolationException e) {
            // ESTE É O SEU ERRO PROVÁVEL
            // Causa mais provável: O idConta não existe na tabela Conta
            String msg = "Erro de integridade dos dados. Causa provável: O idConta '" + dto.getIdConta() + "' não existe na tabela 'Conta'.";
            return new ResponseEntity<>(msg, HttpStatus.UNPROCESSABLE_ENTITY); // 422
        
        } catch (Exception e) {
            // Outros erros inesperados
            return new ResponseEntity<>("Erro interno do servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }
    @GetMapping
    public ResponseEntity<?> listarTodosDepositos() {
        try {
            List<Deposito> depositos = depositoService.listarTodosDepositos();
            return ResponseEntity.ok(depositos);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * GET: Busca um Deposito pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Deposito> obterDepositoPorId(@PathVariable Integer id) {
        try {
            Deposito deposito = depositoService.obterDepositoPorId(id);
            return ResponseEntity.ok(deposito);
        } catch (Exception e) { // Ex: NoSuchElementException
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    /**
     * PUT: Atualiza um Deposito (e Transacao).
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarDeposito(@PathVariable Integer id, @RequestBody DepositoRequestDTO dto) {
        try {
            Deposito depositoAtualizado = depositoService.atualizarDeposito(id, dto);
            return ResponseEntity.ok(depositoAtualizado);

        } catch (IllegalArgumentException e) {
             return new ResponseEntity<>("Requisição inválida: " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400

        } catch (DataIntegrityViolationException e) {
            // Causa provável: O idConta não existe na tabela Conta
            String msg = "Erro de integridade dos dados. Causa provável: O idConta '" + dto.getIdConta() + "' não existe na tabela 'Conta'.";
            return new ResponseEntity<>(msg, HttpStatus.UNPROCESSABLE_ENTITY); // 422
        
        } catch (Exception e) {
            // Se o Deposito com o ID não foi encontrado (vem do service)
            return ResponseEntity.notFound().build(); // 404
        }
    }

    /**
     * DELETE: Deleta um Deposito (e Transacao).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDeposito(@PathVariable Integer id) {
        try {
            depositoService.deletarDeposito(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (Exception e) {
            // Se o Deposito com o ID não foi encontrado
            return ResponseEntity.notFound().build();
        }
    }  
}