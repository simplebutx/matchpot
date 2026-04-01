package com.ibmteam02.backend.global.exception;

public class NoPermissionException extends RuntimeException {
    public NoPermissionException(String message) {
        super(message);
    }

    public NoPermissionException() {
        super("권한이 없습니다.");
    }
}
