package com.ibmteam02.backend.ai.service;

import com.ibmteam02.backend.ai.dto.AiSummarizeRequest;
import com.ibmteam02.backend.ai.dto.AiSummarizeResponse;
import com.ibmteam02.backend.review.dto.ReviewResponse;
import com.ibmteam02.backend.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiSummarizeService {

    private static final String EMPTY_SUMMARY = "분석할 리뷰가 없습니다.";
    private static final String UNAVAILABLE_SUMMARY = "현재 AI 요약 기능을 사용할 수 없습니다.";

    private final RestTemplate restTemplate;
    private final ReviewService reviewService;

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    public AiSummarizeResponse summarizeReviews(Long eventId) {
        List<ReviewResponse> reviews = reviewService.getReviews(eventId).reviews();

        String allText = reviews.stream()
                .map(ReviewResponse::content)
                .filter(content -> content != null && !content.isBlank())
                .collect(Collectors.joining(". "));

        if (allText.isBlank()) {
            return fallbackResponse(eventId, EMPTY_SUMMARY);
        }

        AiSummarizeRequest requestBody = new AiSummarizeRequest(eventId, allText);
        String url = aiServiceBaseUrl + "/analyze";

        try {
            ResponseEntity<AiSummarizeResponse> response =
                    restTemplate.postForEntity(url, requestBody, AiSummarizeResponse.class);

            AiSummarizeResponse body = response.getBody();
            if (body == null || body.getSummary() == null || body.getSummary().isBlank()) {
                return fallbackResponse(eventId, UNAVAILABLE_SUMMARY);
            }

            return new AiSummarizeResponse(
                    eventId,
                    body.getSummary(),
                    body.getKeywords() == null ? List.of() : body.getKeywords(),
                    body.getImprovement()
            );
        } catch (Exception e) {
            return fallbackResponse(eventId, UNAVAILABLE_SUMMARY);
        }
    }

    private AiSummarizeResponse fallbackResponse(Long eventId, String summary) {
        return new AiSummarizeResponse(eventId, summary, List.of(), "개선점 : 현재 AI 분석 기능을 사용할 수 없습니다.");
    }
}
