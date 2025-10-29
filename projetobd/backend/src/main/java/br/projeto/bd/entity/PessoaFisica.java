package br.projeto.bd.entity;

public class PessoaFisica {

    private Integer idCliente; // Esta é PK e FK
    private String sexo;
    private Integer idade;
    private String cpf;

    // Construtor, Getters e Setters

    public PessoaFisica() {
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}