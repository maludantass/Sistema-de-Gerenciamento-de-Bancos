package br.projeto.bd.dto;

// DTO para representar um par de contas na mesma agência
public class ParContasAgenciaDTO {

    private String agencia;
    private String numeroConta1;
    private String numeroConta2;

    // Getters e Setters
    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public String getNumeroConta1() {
        return numeroConta1;
    }

    public void setNumeroConta1(String numeroConta1) {
        this.numeroConta1 = numeroConta1;
    }

    public String getNumeroConta2() {
        return numeroConta2;
    }

    public void setNumeroConta2(String numeroConta2) {
        this.numeroConta2 = numeroConta2;
    }
}