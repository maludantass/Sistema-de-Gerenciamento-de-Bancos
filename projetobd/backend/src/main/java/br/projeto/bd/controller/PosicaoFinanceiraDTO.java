package br.projeto.bd.controller;

import java.math.BigDecimal;

public class PosicaoFinanceiraDTO {
    
    private Integer id_Cliente;
    private String nome_cliente;
    private Integer idConta;
    private BigDecimal saldo;
    private Integer idServico;
    private String descricao_servico;
    private Integer idContrato;
    private BigDecimal valor_contrato;

    // Construtor vazio
    public PosicaoFinanceiraDTO() {}

    // Construtor completo (opcional, facilita testes)
    public PosicaoFinanceiraDTO(Integer id_Cliente, String nome_cliente, Integer idConta, BigDecimal saldo, 
                                Integer idServico, String descricao_servico, Integer idContrato, BigDecimal valor_contrato) {
        this.id_Cliente = id_Cliente;
        this.nome_cliente = nome_cliente;
        this.idConta = idConta;
        this.saldo = saldo;
        this.idServico = idServico;
        this.descricao_servico = descricao_servico;
        this.idContrato = idContrato;
        this.valor_contrato = valor_contrato;
    }

    // Getters e Setters
    public Integer getId_Cliente() { return id_Cliente; }
    public void setId_Cliente(Integer id_Cliente) { this.id_Cliente = id_Cliente; }

    public String getNome_cliente() { return nome_cliente; }
    public void setNome_cliente(String nome_cliente) { this.nome_cliente = nome_cliente; }

    public Integer getIdConta() { return idConta; }
    public void setIdConta(Integer idConta) { this.idConta = idConta; }

    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }

    public Integer getIdServico() { return idServico; }
    public void setIdServico(Integer idServico) { this.idServico = idServico; }

    public String getDescricao_servico() { return descricao_servico; }
    public void setDescricao_servico(String descricao_servico) { this.descricao_servico = descricao_servico; }

    public Integer getIdContrato() { return idContrato; }
    public void setIdContrato(Integer idContrato) { this.idContrato = idContrato; }

    public BigDecimal getValor_contrato() { return valor_contrato; }
    public void setValor_contrato(BigDecimal valor_contrato) { this.valor_contrato = valor_contrato; }
}

