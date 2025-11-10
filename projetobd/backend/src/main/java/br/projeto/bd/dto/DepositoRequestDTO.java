package br.projeto.bd.dto;

import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) para receber a requisição POST/PUT para Deposito.
 * Necessário para receber 'dataHora' como String.
 */
public class DepositoRequestDTO {

    // Campos da Transacao
    private Integer idTransacao; // Manual
    private Integer idConta;
    private String dataHora;     // Manual (ex: "2024-10-25 14:30:00")

    // Campos do Deposito
    private String origemValor;
    private String metodoDeposito;
    private BigDecimal valorDeposito;

    // Getters e Setters
    
    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public String getDataHora() {
        return dataHora;
    }

    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    public String getOrigemValor() {
        return origemValor;
    }

    public void setOrigemValor(String origemValor) {
        this.origemValor = origemValor;
    }

    public String getMetodoDeposito() {
        return metodoDeposito;
    }

    public void setMetodoDeposito(String metodoDeposito) {
        this.metodoDeposito = metodoDeposito;
    }

    public BigDecimal getValorDeposito() {
        return valorDeposito;
    }

    public void setValorDeposito(BigDecimal valorDeposito) {
        this.valorDeposito = valorDeposito;
    }
}