package com.ibmteam02.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AiSummarizeResponse {
    private Long eventId;
    private String summary;
    private List<String> keywords;
    private String improvement;
}
