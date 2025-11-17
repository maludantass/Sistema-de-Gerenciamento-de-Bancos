package br.projeto.bd.controller;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.projeto.bd.dto.AuditoriaContaTransacaoDTO; // Import necessário
import br.projeto.bd.dto.ParContasAgenciaDTO;
import br.projeto.bd.entity.Conta;
import br.projeto.bd.service.ContaService;

@RestController
@RequestMapping("/api/contas")
public class ContaController {

    @Autowired
    private ContaService contaService;

    // ... (Métodos CRUD e os dois métodos novos que você já tinha)

    // CREATE -> POST /api/contas
    @PostMapping
    public ResponseEntity<Conta> criarConta(@RequestBody Conta conta) {
        Conta novaConta = contaService.criarConta(conta);
        return new ResponseEntity<>(novaConta, HttpStatus.CREATED);
    }

    // READ -> GET /api/contas
    @GetMapping
    public List<Conta> listarTodasContas() {
        return contaService.listarTodas();
    }

    // READ -> GET /api/contas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarContaPorId(@PathVariable Integer id) {
        return contaService.buscarPorId(id)
                .map(ResponseEntity::ok) 
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE -> PUT /api/contas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Conta> atualizarConta(@PathVariable Integer id, @RequestBody Conta contaDetails) {
        return contaService.buscarPorId(id)
                .map(contaExistente -> {
                    Conta contaAtualizada = contaService.atualizarConta(id, contaDetails);
                    return ResponseEntity.ok(contaAtualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE -> DELETE /api/contas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConta(@PathVariable Integer id) {
        return contaService.buscarPorId(id)
                .map(conta -> {
                    contaService.deletarConta(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // --- NOVOS ENDPOINTS (EXISTENTES) ---

    /**
     * Endpoint para a consulta com SELF JOIN.
     * GET /api/contas/pares-por-agencia
     */
    @GetMapping("/pares-por-agencia")
    public List<ParContasAgenciaDTO> getParesDeContasPorAgencia() {
        return contaService.encontrarParesDeContasPorAgencia();
    }

    /**
     * Endpoint para a consulta complexa (busca por faixa de saldo).
     * GET /api/contas/buscar-por-saldo?min=1000&max=5000
     */
    @GetMapping("/buscar-por-saldo")
    public List<Conta> getContasPorFaixaDeSaldo(
            @RequestParam("min") BigDecimal saldoMin,
            @RequestParam("max") BigDecimal saldoMax) {
        return contaService.buscarContasPorFaixaDeSaldo(saldoMin, saldoMax);
    }

    // --- NOVOS ENDPOINTS (CÓDIGO FALTANTE) ---

    /**
     * Endpoint para a CONSULTA 3: SUBCONSULTA.
     * Busca contas que tiveram depósitos acima de um valor mínimo.
     * GET /api/contas/depositos-acima?valor=500.00
     */
    @GetMapping("/depositos-acima/{valor}")
    public List<Conta> getContasComDepositosAcimaDe(
            @PathVariable("valor") BigDecimal valorMinimo) {
        return contaService.encontrarContasComDepositosAcimaDe(valorMinimo);
    }

    /**
     * Endpoint para a CONSULTA 4: FULL OUTER JOIN (Relatório de Auditoria).
     * Retorna um relatório de auditoria de Contas e Transações.
     * GET /api/contas/relatorio-auditoria
     */
    @GetMapping("/relatorio-auditoria")
    public List<AuditoriaContaTransacaoDTO> getRelatorioAuditoria() {
        return contaService.gerarRelatorioAuditoriaContasTransacoes();
    }
}