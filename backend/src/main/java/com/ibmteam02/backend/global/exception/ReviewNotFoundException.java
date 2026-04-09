package com.ibmteam02.backend.global.exception;

public class ReviewNotFoundException extends RuntimeException {
    public ReviewNotFoundException(String message) {
        super(message);
    }

    public ReviewNotFoundException() {
        super("리뷰를 찾을 수 없습니다.");
    }
}
