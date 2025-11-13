package br.projeto.bd.entity;

import java.sql.Timestamp;

/**
 * Classe base (abstrata) para Transacoes.
 * Esta é a classe que Saque e Deposito herdam.
 */
public abstract class Transacao {

    private Integer idTransacao;
    private Timestamp dataHora;
    private Integer idConta;

    // Construtor vazio
    public Transacao() {
    }

    // Getters e Setters

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public Timestamp getDataHora() {
        return dataHora;
    }

    public void setDataHora(Timestamp dataHora) {
        this.dataHora = dataHora;
    }

    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }
}