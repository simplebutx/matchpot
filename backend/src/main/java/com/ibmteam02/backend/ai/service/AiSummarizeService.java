package com.ibmteam02.backend.ai.service;

import com.ibmteam02.backend.review.dto.ReviewResponse;
import com.ibmteam02.backend.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiSummarizeService {

    private final RestTemplate restTemplate;
    private final ReviewService reviewService;

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    public Map<String, Object> summarizeReviews(Long eventId) {
        List<ReviewResponse> reviews = reviewService.getReviews(eventId).reviews();

        if (reviews.isEmpty()) {
            return Map.of("summary", "분석할 리뷰가 없습니다.", "keywords", List.of());
        }

        String allText = reviews.stream()
                .map(ReviewResponse::content)
                .filter(content -> content != null && !content.isBlank())
                .collect(Collectors.joining(". "));

        Map<String, Object> requestBody = Map.of(
                "eventId", eventId,
                "allText", allText
        );

        String url = aiServiceBaseUrl + "/analyze";

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("summary", "현재 AI 요약 기능을 사용할 수 없습니다.", "keywords", List.of());
        }
    }
}
