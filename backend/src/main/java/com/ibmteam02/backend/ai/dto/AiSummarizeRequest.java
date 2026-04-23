package com.ibmteam02.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AiSummarizeRequest {
    private Long eventId;
    private String allTest;
}
