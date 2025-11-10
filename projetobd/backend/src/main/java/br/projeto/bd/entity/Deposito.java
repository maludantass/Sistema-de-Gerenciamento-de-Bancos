package br.projeto.bd.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "Deposito")
public class Deposito extends Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTransacao; // Esta é PK e FK
    private String origemValor;
    private String metodoDeposito;
    private BigDecimal valorDeposito;

    // Construtor, Getters e Setters

    public Deposito() {
    }

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
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