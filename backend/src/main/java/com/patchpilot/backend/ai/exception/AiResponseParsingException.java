package com.patchpilot.backend.ai.exception;

import com.patchpilot.backend.common.exception.BadRequestException;

public class AiResponseParsingException extends BadRequestException {

    public AiResponseParsingException(Throwable cause) {
        super("Failed to parse AI response.", cause);
    }
}