package com.ibmteam02.backend.event.dto;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.domain.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventListResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime recruitStartAt;
    private LocalDateTime recruitEndAt;
    private Integer price;
    private Integer maxTickets;
    private Integer remainingTickets;
    private Status status;
    private String imageKey;
    private String authorName;
    private Double positiveRate;
    private Double neutralRate;
    private Double negativeRate;

    public EventListResponse(
            Long id,
            String title,
            String description,
            String location,
            LocalDateTime startAt,
            LocalDateTime endAt,
            LocalDateTime recruitStartAt,
            LocalDateTime recruitEndAt,
            Integer price,
            Integer maxTickets,
            Integer remainingTickets,
            Status status,
            String imageKey,
            String authorName,
            Double positiveRate,
            Double neutralRate,
            Double negativeRate
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.startAt = startAt;
        this.endAt = endAt;
        this.recruitStartAt = recruitStartAt;
        this.recruitEndAt = recruitEndAt;
        this.price = price;
        this.maxTickets = maxTickets;
        this.remainingTickets = remainingTickets;
        this.status = status;
        this.imageKey = imageKey;
        this.authorName = authorName;
        this.positiveRate = positiveRate;
        this.neutralRate = neutralRate;
        this.negativeRate = negativeRate;
    }

    public EventListResponse(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.location = event.getLocation();
        this.startAt = event.getStartAt();
        this.endAt = event.getEndAt();
        this.recruitStartAt = event.getRecruitStartAt();
        this.recruitEndAt = event.getRecruitEndAt();
        this.price = event.getPrice();
        this.maxTickets = event.getMaxTickets();
        this.remainingTickets = event.getMaxTickets();
        this.status = event.getStatus();
        this.imageKey = event.getImageKey();
        this.authorName = event.getUser().getDisplayName();
        this.positiveRate = 0.0;
        this.neutralRate = 0.0;
        this.negativeRate = 0.0;
    }

    public static EventListResponse from(Event event, Integer remainingTickets) {
        EventListResponse response = new EventListResponse(event);
        response.remainingTickets = remainingTickets;
        return response;
    }

    public static EventListResponse forRecommendation(Event event, String imageUrl) {
        EventListResponse response = new EventListResponse(event);
        response.remainingTickets = event.getMaxTickets();
        response.imageKey = imageUrl;
        response.positiveRate = 0.0;
        response.neutralRate = 0.0;
        response.negativeRate = 0.0;
        return response;
    }
}
