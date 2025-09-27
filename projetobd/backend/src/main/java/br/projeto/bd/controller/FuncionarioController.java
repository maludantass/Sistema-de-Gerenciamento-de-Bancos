package br.projeto.bd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import br.projeto.bd.entity.Funcionario;
import br.projeto.bd.service.FuncionarioService;

@RestController
@RequestMapping("/api/funcionarios") // Define a URL base para todos os endpoints deste controller
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    // CREATE -> POST /api/funcionarios
    @PostMapping
    public ResponseEntity<Funcionario> criarFuncionario(@RequestBody Funcionario funcionario) {
        Funcionario novoFuncionario = funcionarioService.criarFuncionario(funcionario);
        return new ResponseEntity<>(novoFuncionario, HttpStatus.CREATED);
    }

    // READ -> GET /api/funcionarios
    @GetMapping
    public List<Funcionario> listarTodosFuncionarios() {
        return funcionarioService.listarTodos();
    }  

    // READ -> GET /api/funcionarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarFuncionarioPorId(@PathVariable Integer id) {
        return funcionarioService.buscarPorId(id)
                .map(funcionario -> ResponseEntity.ok(funcionario))
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE -> PUT /api/funcionarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizarFuncionario(@PathVariable Integer id, @RequestBody Funcionario funcionarioDetails) {
        // Verifica se o funcionário existe antes de atualizar
        return funcionarioService.buscarPorId(id)
                .map(funcionarioExistente -> {
                    Funcionario funcionarioAtualizado = funcionarioService.atualizarFuncionario(id, funcionarioDetails);
                    return ResponseEntity.ok(funcionarioAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE -> DELETE /api/funcionarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFuncionario(@PathVariable Integer id) {
        // Verifica se o funcionário existe antes de deletar
         return funcionarioService.buscarPorId(id)
                .map(funcionario -> {
                    funcionarioService.deletarFuncionario(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}