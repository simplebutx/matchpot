package com.ibmteam02.backend.ai.controller;

import com.ibmteam02.backend.ai.service.AiSummarizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiSummarizeController {

    private final AiSummarizeService aiSummarizeService;

    @GetMapping("/analyze/summarize/{eventId}")
    public ResponseEntity<Map<String, Object>> summarizeReviews(@PathVariable Long eventId) {

        Map<String, Object> result = aiSummarizeService.summarizeReviews(eventId);

        return ResponseEntity.ok(result);
    }
}
