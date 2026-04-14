package com.ibmteam02.backend.global.exception;

public class EmailNotVerifiedException extends RuntimeException{
    public EmailNotVerifiedException(String message) {
        super(message);
    }

    public EmailNotVerifiedException() {
        super("이메일 인증이 완료되지 않았습니다");
    }
}
