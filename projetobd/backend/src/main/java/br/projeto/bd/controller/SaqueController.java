package br.projeto.bd.controller;

import br.projeto.bd.dto.SaqueRequestDTO;
import br.projeto.bd.entity.Saque;
import br.projeto.bd.service.SaqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saques") // Define a rota base
public class SaqueController {

    @Autowired
    private SaqueService saqueService;

    /**
     * POST: Cria um novo Saque (e a Transacao correspondente).
     */
    @PostMapping
    public ResponseEntity<Saque> criarSaque(@RequestBody SaqueRequestDTO dto) {
        try {
            Saque novoSaque = saqueService.realizarSaque(dto);
            // Retorna 201 Created com o objeto criado
            return new ResponseEntity<>(novoSaque, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Se o formato da data estiver errado, por exemplo
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Se o ID já existir (Primary Key violation)
            return new ResponseEntity<>(null, HttpStatus.CONFLICT); // 409 Conflict
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
        } catch (Exception e) { // Ex: EmptyResultDataAccessException
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    /**
     * PUT: Atualiza um Saque (e a Transacao correspondente).
     * O ID na URL tem precedência sobre o ID no corpo.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Saque> atualizarSaque(@PathVariable Integer id, @RequestBody SaqueRequestDTO dto) {
        try {
            Saque saqueAtualizado = saqueService.atualizarSaque(id, dto);
            return ResponseEntity.ok(saqueAtualizado);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Se o Saque com o ID não foi encontrado
            return ResponseEntity.notFound().build();
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
        } catch (Exception e) {
            // Se o Saque com o ID não foi encontrado
            return ResponseEntity.notFound().build();
        }
    }
}