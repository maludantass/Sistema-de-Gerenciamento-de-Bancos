package br.projeto.bd.entity;

public class PessoaJuridica {

    private Integer idCliente; // Esta é PK e FK
    private String cnpj;
    private String tipo;

    // Construtor, Getters e Setters

    public PessoaJuridica() {
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
