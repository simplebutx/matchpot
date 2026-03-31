package com.ibmteam02.backend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

public record ErrorResponse(int status, String message) {
}
