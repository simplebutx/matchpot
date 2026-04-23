package com.ibmteam02.backend.ai.service;

import com.ibmteam02.backend.ai.dto.AiRequest;
import com.ibmteam02.backend.review.dto.ReviewResponse;
import com.ibmteam02.backend.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate;
    private final ReviewService reviewService;

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    public Map<String, Object> analyzeReviews(Long eventId) {
        String url = aiServiceBaseUrl + "/internal/reviews/analyze";

        List<ReviewResponse> reviews = reviewService.getReviews(eventId);

        List<AiRequest> requestBody = reviews.stream()
                .map(review -> new AiRequest(review.eventId(), review.id(), review.content()))
                .toList();

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }


}
