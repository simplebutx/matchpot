package com.ibmteam02.backend.global.exception;

public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException(String message) {
        super(message);
    }

    public TicketNotFoundException() {
        super("티켓을 찾을 수 없습니다.");
    }
}
