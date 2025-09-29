package br.projeto.bd.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // Retorna 400 - A requisição é inválida
public class SupervisorNaoEncontradoException extends RuntimeException {

    public SupervisorNaoEncontradoException(String message) {
        super(message);
    }
}