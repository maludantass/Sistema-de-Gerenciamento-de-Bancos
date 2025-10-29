package br.projeto.bd.entity;

public class Telefone {

    private String numero; // Esta é a PK
    private Integer idCliente;

    // Construtor, Getters e Setters

    public Telefone() {
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }
}
