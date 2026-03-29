package com.ibmteam02.backend.global.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(String message) {
        super(message);
    }

    public EventNotFoundException() {
        super("행사를 찾을 수 없습니다.");
    }
}
