package br.projeto.bd.dto;

import java.math.BigDecimal;
// Não precisamos de Timestamp aqui, recebemos String para facilitar o JSON.

/**
 * DTO (Data Transfer Object) para receber a requisição POST.
 * ATUALIZADO: O cliente agora deve fornecer TODOS os dados manualmente,
 * incluindo idTransacao e dataHora (como String).
 */
public class SaqueRequestDTO {

    // Campos da Transacao
    private Integer idTransacao; // NOVO: Fornecido pelo usuário
    private Integer idConta;
    private String dataHora;     // NOVO: Fornecido pelo usuário (ex: "2024-10-25 14:30:00")

    // Campos do Saque
    private String tipoSaque;
    private BigDecimal limiteUtilizado;
    private BigDecimal valorSaque;

    // Getters e Setters

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public String getDataHora() {
        return dataHora;
    }

    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    public String getTipoSaque() {
        return tipoSaque;
    }

    public void setTipoSaque(String tipoSaque) {
        this.tipoSaque = tipoSaque;
    }

    public BigDecimal getLimiteUtilizado() {
        return limiteUtilizado;
    }

    public void setLimiteUtilizado(BigDecimal limiteUtilizado) {
        this.limiteUtilizado = limiteUtilizado;
    }

    public BigDecimal getValorSaque() {
        return valorSaque;
    }

    public void setValorSaque(BigDecimal valorSaque) {
        this.valorSaque = valorSaque;
    }
}