package br.projeto.bd.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Saque")
public class Saque extends Transacao {
    @Id
    @Column(name = "idTransacao")
    private Integer idTransacao;

    @Column(name = "tipo_saque", length = 50)
    private String tipoSaque;

    @Column(name = "limite_utilizado", precision = 10, scale = 2)
    private BigDecimal limiteUtilizado;

    @Column(name = "valor_saque", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorSaque;

    
    // Construtor vazio (necessário para frameworks e instâncias simples)
    public Saque() {
    }

    // Construtor completo
    public Saque(int idTransacao, String tipoSaque, BigDecimal limiteUtilizado, BigDecimal valorSaque) {
        this.idTransacao = idTransacao;
        this.tipoSaque = tipoSaque;
        this.limiteUtilizado = limiteUtilizado;
        this.valorSaque = valorSaque;
    }
    // Getters e Setters
 
    public void setIdTransacao(int idTransacao) {
        this.idTransacao = idTransacao;
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
        if (valorSaque.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do saque deve ser maior que zero.");
        }
        this.valorSaque = valorSaque;
    }

    // Método toString() para exibir informações do saque
    @Override
    public String toString() {
        return "Saque {" +
                "idTransacao=" + idTransacao +
                ", tipoSaque='" + tipoSaque + '\'' +
                ", limiteUtilizado=" + limiteUtilizado +
                ", valorSaque=" + valorSaque +
                '}';
    }
}
