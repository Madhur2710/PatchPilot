package com.patchpilot.backend.common.exception;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}