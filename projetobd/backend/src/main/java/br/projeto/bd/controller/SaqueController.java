package br.projeto.bd.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException; // Importar
import org.springframework.http.HttpStatus; // Importar
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // Importar
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.projeto.bd.dto.SaqueRequestDTO;
import br.projeto.bd.entity.Saque;
import br.projeto.bd.service.SaqueService;

@RestController
@RequestMapping("/api/saques") // Define a rota base
public class SaqueController {

    @Autowired
    private SaqueService saqueService;

    /**
     * POST: Cria um novo Saque (e a Transacao correspondente).
     */
    @PostMapping
    public ResponseEntity<?> criarSaque(@RequestBody SaqueRequestDTO dto) {
        try {
            Saque novoSaque = saqueService.realizarSaque(dto);
            // Retorna 201 Created com o objeto criado
            return new ResponseEntity<>(novoSaque, HttpStatus.CREATED);
       
        } catch (IllegalArgumentException e) {
            // Erro no formato da data ou validação do DTO
            return new ResponseEntity<>("Requisição inválida: " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
        
        } catch (DuplicateKeyException e) {
            // O idTransacao REALMENTE já existe
            return new ResponseEntity<>("Conflito: O idTransacao " + dto.getIdTransacao() + " já existe.", HttpStatus.CONFLICT); // 409
        
        } catch (DataIntegrityViolationException e) {
            // ESTE É O SEU ERRO ATUAL
            // Causa mais provável: O idConta não existe na tabela Conta
            String msg = "Erro de integridade dos dados. Causa provável: O idConta '" + dto.getIdConta() + "' não existe na tabela 'Conta'.";
            return new ResponseEntity<>(msg, HttpStatus.UNPROCESSABLE_ENTITY); // 422
        
        } catch (Exception e) {
            // Outros erros inesperados
            return new ResponseEntity<>("Erro interno do servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }

    /**
     * GET: Busca um Saque pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Saque> obterSaquePorId(@PathVariable Integer id) {
        try {
            Saque saque = saqueService.obterSaquePorId(id);
            return ResponseEntity.ok(saque);
        } catch (NoSuchElementException e) { // Sendo específico
            return ResponseEntity.notFound().build(); // 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping
    public ResponseEntity<?> listarTodosSaques() {
        try {
            List<Saque> saques = saqueService.listarTodosSaques();
            // Retorna 200 OK com a lista (pode estar vazia: [])
            return ResponseEntity.ok(saques);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * PUT: Atualiza um Saque (e a Transacao correspondente).
     * O ID na URL tem precedência sobre o ID no corpo.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarSaque(@PathVariable Integer id, @RequestBody SaqueRequestDTO dto) {
        try {
            Saque saqueAtualizado = saqueService.atualizarSaque(id, dto);
            return ResponseEntity.ok(saqueAtualizado);

        } catch (IllegalArgumentException e) {
             return new ResponseEntity<>("Requisição inválida: " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400

        } catch (DataIntegrityViolationException e) {
            // Causa provável: O idConta não existe na tabela Conta
            String msg = "Erro de integridade dos dados. Causa provável: O idConta '" + dto.getIdConta() + "' não existe na tabela 'Conta'.";
            return new ResponseEntity<>(msg, HttpStatus.UNPROCESSABLE_ENTITY); // 422
        
        } catch (NoSuchElementException e) {
            // Se o Saque com o ID não foi encontrado (vem do service)
            return new ResponseEntity<>("Saque com ID " + id + " não encontrado.", HttpStatus.NOT_FOUND); // 404
        
        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }

    /**
     * DELETE: Deleta um Saque (e a Transacao correspondente).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarSaque(@PathVariable Integer id) {
        try {
            saqueService.deletarSaque(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (NoSuchElementException e) {
            // Se o Saque com o ID não foi encontrado
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}