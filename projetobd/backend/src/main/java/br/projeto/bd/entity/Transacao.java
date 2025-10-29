package br.projeto.bd.entity;

import java.security.Timestamp;

public class Transacao {
    private Integer idTransacao;
    private Timestamp dataHora;
    private Integer idConta;

    // Construtor, Getters e Setters

    public Transacao() {
    }

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
