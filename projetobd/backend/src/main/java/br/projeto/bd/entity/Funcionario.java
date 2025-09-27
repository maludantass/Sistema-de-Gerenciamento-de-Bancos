package br.projeto.bd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Funcionario")
public class Funcionario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFuncionario;

    @Column(nullable = false)
    private String nome;

    private String funcao;

    // Relação com Solicitação (opcional, pode ser null)
    private Integer id_solicitacao;

    // Auto-relacionamento para supervisor
    private Integer idSupervisor;

    // Getters e Setters
    public Integer getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Integer idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFuncao() {
        return funcao;
    }

    public void setFuncao(String funcao) {
        this.funcao = funcao;
    }

    public Integer getId_solicitacao() {
        return id_solicitacao;
    }

    public void setId_solicitacao(Integer id_solicitacao) {
        this.id_solicitacao = id_solicitacao;
    }

    public Integer getIdSupervisor() {
        return idSupervisor;
    }

    public void setIdSupervisor(Integer idSupervisor) {
        this.idSupervisor = idSupervisor;
    }
}
