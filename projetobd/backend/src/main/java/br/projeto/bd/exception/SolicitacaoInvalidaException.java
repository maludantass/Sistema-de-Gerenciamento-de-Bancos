package br.projeto.bd.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção lançada quando uma operação inválida relacionada a uma Solicitação é tentada.
 * A anotação @ResponseStatus(HttpStatus.BAD_REQUEST) faz com que o Spring retorne
 * automaticamente o status HTTP 400 (Bad Request) quando esta exceção é lançada.
 */  
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SolicitacaoInvalidaException extends RuntimeException {

    public SolicitacaoInvalidaException(String message) {
        super(message);
    }
}