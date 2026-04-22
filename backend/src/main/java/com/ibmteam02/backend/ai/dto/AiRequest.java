package com.ibmteam02.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiRequest {
    private Long id;
    private String content;
}
