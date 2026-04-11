package com.ibmteam02.backend.event.dto;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
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
    private Integer remainingTickets; //남음 티켓 수량
    private Status status;
    private String imageKey;
    private String authorName;

    private static final String S3_BUCKET_URL = "https://ibmteam2-s3-admin.s3.ap-northeast-2.amazonaws.com/";

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
        this.imageKey = event.getImageKey() != null ? S3_BUCKET_URL + event.getImageKey() : null;
        this.authorName = event.getUser().getDisplayName();
    }

    public static EventDetailResponse from(Event event,Integer remainingTickets) {
        return new EventDetailResponse(
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
                remainingTickets,
                event.getStatus(),
                event.getImageKey() != null ? S3_BUCKET_URL + event.getImageKey() : null,
                event.getUser().getDisplayName()
        );
    }
}

