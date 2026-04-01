package com.ibmteam02.backend.global.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }

    public DuplicateEmailException() {super("이미 가입되어있는 이메일입니다.");}
}
