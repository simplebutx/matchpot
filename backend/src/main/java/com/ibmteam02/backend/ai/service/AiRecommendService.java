package com.ibmteam02.backend.ai.service;

import com.ibmteam02.backend.ai.dto.AiRecommendRequest;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiRecommendService {
    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final RestTemplate restTemplate;

    @Value("${cloud.aws.s3.base-url}")
    private String s3BaseUrl;

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    public Map<String, Object> getRecommendations(Long userId) {
        try {
            // 1. 유저 티켓 조회
            var myTickets = ticketRepository.findAllByUserIdWithEvent(userId);

            if (myTickets.isEmpty()) {
                System.out.println("⚠️ 티켓이 없어서 추천을 진행할 수 없습니다.");
                return Map.of("recommended_events", List.of(), "message", "예약 내역이 없습니다.");
            }

            // 2. 유저 히스토리 문자열 생성
            String userHistory = myTickets.stream()
                    .map(t -> t.getEvent().getTitle() + " " + t.getEvent().getDescription())
                    .collect(java.util.stream.Collectors.joining(" "));

            // 3. 전체 행사 정보 생성
            var allEvents = eventRepository.findAll().stream()
                    .map(e -> new AiRecommendRequest.EventInfo(e.getId(), e.getTitle()))
                    .toList();

            // 4. 파이썬 전송
            String url = aiServiceBaseUrl + "/recommend";
            AiRecommendRequest request = new AiRecommendRequest(userHistory, allEvents);


            RestTemplate tempTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> pythonResponse = response.getBody();

            if (pythonResponse != null && pythonResponse.containsKey("recommended_ids")) {
                List<Integer> recommendedIds = (List<Integer>) pythonResponse.get("recommended_ids");
                List<Long> longIds = recommendedIds.stream().map(Integer::longValue).toList();

                // 🌟 2. 보낸 코드랑 똑같은 방식으로 맵핑 (이미지 빌드 포함)
                List<EventListResponse> recommendedEvents = eventRepository.findAllById(longIds).stream()
                        .filter(event -> myTickets.stream()
                                .noneMatch(t -> t.getEvent().getId().equals(event.getId())))
                        .map(event -> new EventListResponse(
                                event.getId(),
                                event.getTitle(),
                                event.getDescription(),
                                event.getLocation(),
                                event.getStartAt(),
                                event.getEndAt(),
                                event.getRecruitStartAt(),
                                event.getRecruitEndAt(),
                                event.getPrice(),
                                event.getMaxTickets(),
                                event.getMaxTickets(), // 잔여좌석 (우선 전체로 처리)
                                event.getStatus(),
                                buildImageUrl(event.getImageKey()), // 🌟 여기서 이미지 주소 완성!
                                event.getUser().getDisplayName()
                        ))
                        .toList();

                return Map.of("recommended_events", recommendedEvents);
            }

            // 파이썬 응답이 올바르지 않을 경우를 대비한 기본 리턴
            return Map.of("recommended_events", List.of());

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "추천 로직 실패: " + e.getMessage());
        }
    } // 메서드 끝

    private String buildImageUrl(String imageKey) {
        if (imageKey == null || imageKey.isBlank()) {
            return null;
        }
        if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) {
            return imageKey;
        }
        return s3BaseUrl + imageKey;
    }
}
