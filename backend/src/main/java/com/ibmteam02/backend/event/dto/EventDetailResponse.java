package com.ibmteam02.backend.event.dto;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.domain.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventDetailResponse {

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

    public EventDetailResponse(
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
            String authorName
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
    }

    public EventDetailResponse(Event event) {
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
    }

    public static EventDetailResponse from(Event event, Integer remainingTickets) {
        EventDetailResponse response = new EventDetailResponse(event);
        response.remainingTickets = remainingTickets;
        return response;
    }
}
