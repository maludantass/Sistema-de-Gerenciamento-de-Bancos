package br.projeto.bd.dto;

public class AuditoriaContaTransacaoDTO {
    private Integer idConta;
    private String agencia;
    private String numeroConta;
    private Integer idTransacao;
    private java.sql.Timestamp dataHoraTransacao;
    
    // Getters e Setters


    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public String getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public java.sql.Timestamp getDataHoraTransacao() {
        return dataHoraTransacao;
    }

    public void setDataHoraTransacao(java.sql.Timestamp dataHoraTransacao) {
        this.dataHoraTransacao = dataHoraTransacao;
    }
}