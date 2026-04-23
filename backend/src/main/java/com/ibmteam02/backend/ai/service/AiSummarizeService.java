package com.ibmteam02.backend.ai.service;

import com.ibmteam02.backend.ai.dto.AiSummarizeRequest;
import com.ibmteam02.backend.review.domain.Review;
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

    //리뷰 요약 및 한줄평 메서드
    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    public Map<String, Object> summarizeReviews(Long eventId) {
        // 1. 팀원분과 똑같은 방식으로 리뷰 리스트를 가져옵니다.
        List<ReviewResponse> reviews = reviewService.getReviews(eventId);

        if (reviews.isEmpty()) {
            return Map.of("summary", "분석할 리뷰가 없습니다.", "keywords", List.of());
        }

        // 2. 🌟 여기서 차이점! 요약은 '리스트'가 아니라 '하나의 긴 텍스트'가 필요해요.
        // 리뷰 내용들만 마침표로 구분해서 쫙 합쳐줍니다.
        String allText = reviews.stream()
                .map(ReviewResponse::content) // 혹은 .getContent()
                .filter(content -> content != null && !content.isBlank())
                .collect(Collectors.joining(". "));

        // 3. 파이썬의 @app.post("/analyze") 규격에 맞게 데이터를 포장합니다.
        Map<String, Object> requestBody = Map.of(
                "eventId", eventId,
                "allText", allText
        );

        // 4. 팀원분 스타일대로 restTemplate 호출!
        String url = aiServiceBaseUrl + "/analyze"; // 요약용 주소

        try {
            System.out.println("보내는 주소: " + url); // 👈 로그 추가
            System.out.println("보내는 내용: " + requestBody); // 👈 로그 추가

            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);

            System.out.println("파이썬 응답 성공!: " + response.getBody()); // 👈 로그 추가
            return response.getBody();
        } catch (Exception e) {
            System.err.println("🚨 AI 서버 통신 에러 발생!!!"); // 👈 눈에 띄게 추가
            e.printStackTrace(); // 👈 상세 에러 내용을 콘솔에 찍어줍니다.
            return Map.of("summary", "현재 AI 요약 기능을 사용할 수 없습니다.", "keywords", List.of());
        }
    }
}
