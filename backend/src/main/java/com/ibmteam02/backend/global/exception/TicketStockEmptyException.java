package com.ibmteam02.backend.global.exception;

public class TicketStockEmptyException extends RuntimeException {
    public TicketStockEmptyException(String message) {
        super(message);
    }

    public TicketStockEmptyException() {super("현재 티켓 재고가 없습니다");}
}
