package com.ibmteam02.backend.review.controller;

import com.ibmteam02.backend.review.dto.ReviewResponse;
import com.ibmteam02.backend.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiController {

    private final RestTemplate restTemplate;
    private final ReviewService reviewService;

    @GetMapping("/analyze/{eventId}")
    public ResponseEntity<Map> analyzeReviews(@PathVariable Long eventId){
        String url = "http://localhost:8000/ai/analyze";

        List<ReviewResponse> reviews = reviewService.getReviews(eventId);

        List<Map<String, Object>> realData = reviews.stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.id());
                    map.put("content", r.content());
                    return map;
                })
                .toList();
        try{
            ResponseEntity<Map> response = restTemplate.postForEntity(url,realData,Map.class);
            return ResponseEntity.ok(response.getBody());
        }catch (Exception e){
            Map<String, String> error = Map.of("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
