package com.ibmteam02.backend.ai.controller;

import com.ibmteam02.backend.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @GetMapping("/analyze/{eventId}")
    public ResponseEntity<Map<String, Object>> analyzeReviews(@PathVariable Long eventId) {
        return ResponseEntity.ok(aiService.analyzeReviews(eventId));
    }
}
