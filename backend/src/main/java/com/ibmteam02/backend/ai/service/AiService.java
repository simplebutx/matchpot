package com.ibmteam02.backend.ai.service;

import com.ibmteam02.backend.ai.dto.AiRequest;
import com.ibmteam02.backend.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate;
    private final ReviewRepository reviewRepository;

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    public Map<String, Object> analyzeReviews(Long eventId) {
        String url = aiServiceBaseUrl + "/internal/reviews/analyze";

        List<AiRequest> requestBody = reviewRepository.findAllByEventIdOrderByCreatedAtDesc(eventId)
                .stream()
                .map(review -> new AiRequest(review.getEvent().getId(), review.getId(), review.getContent()))
                .toList();

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    public String analyzeEventSentiment(Long eventId) {
        Map<String, Object> response = analyzeReviews(eventId);
        Object data = response.get("data");

        if (!(data instanceof Map<?, ?> dataMap)) {
            return null;
        }

        Object sentiment = dataMap.get("sentiment");
        if (sentiment == null) {
            return null;
        }

        String value = Objects.toString(sentiment, null);
        return (value == null || value.isBlank()) ? null : value;
    }
}
