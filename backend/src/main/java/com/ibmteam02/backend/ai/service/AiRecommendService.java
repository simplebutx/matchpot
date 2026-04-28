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
            var myTickets = ticketRepository.findAllByUserIdWithEvent(userId);

            if (myTickets.isEmpty()) {
                System.out.println("사용자 예매 내역이 없어 추천을 진행할 수 없습니다.");
                return Map.of("recommended_events", List.of(), "message", "예매 내역이 없습니다.");
            }

            String userHistory = myTickets.stream()
                    .map(t -> t.getEvent().getTitle() + " " + t.getEvent().getDescription())
                    .collect(java.util.stream.Collectors.joining(" "));

            var allEvents = eventRepository.findAll().stream()
                    .map(e -> new AiRecommendRequest.EventInfo(e.getId(), e.getTitle()))
                    .toList();

            String url = aiServiceBaseUrl + "/recommend";
            AiRecommendRequest request = new AiRecommendRequest(userHistory, allEvents);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> pythonResponse = response.getBody();

            if (pythonResponse != null && pythonResponse.containsKey("recommended_ids")) {
                List<Integer> recommendedIds = (List<Integer>) pythonResponse.get("recommended_ids");
                List<Long> longIds = recommendedIds.stream().map(Integer::longValue).toList();

                List<EventListResponse> recommendedEvents = eventRepository.findAllById(longIds).stream()
                        .filter(event -> myTickets.stream()
                                .noneMatch(t -> t.getEvent().getId().equals(event.getId())))
                        .map(event -> EventListResponse.forRecommendation(
                                event,
                                buildImageUrl(event.getImageKey())
                        ))
                        .toList();

                return Map.of("recommended_events", recommendedEvents);
            }

            return Map.of("recommended_events", List.of());

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "추천 로직 실패: " + e.getMessage());
        }
    }

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
