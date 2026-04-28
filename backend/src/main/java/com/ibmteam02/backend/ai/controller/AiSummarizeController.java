package com.ibmteam02.backend.ai.controller;

import com.ibmteam02.backend.ai.dto.AiSummarizeResponse;
import com.ibmteam02.backend.ai.service.AiSummarizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiSummarizeController {

    private final AiSummarizeService aiSummarizeService;

    @GetMapping("/analyze/summarize/{eventId}")
    public ResponseEntity<AiSummarizeResponse> summarizeReviews(@PathVariable Long eventId) {
        return ResponseEntity.ok(aiSummarizeService.summarizeReviews(eventId));
    }
}
