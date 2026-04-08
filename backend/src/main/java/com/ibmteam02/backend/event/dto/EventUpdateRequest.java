package com.ibmteam02.backend.event.dto;

import com.ibmteam02.backend.event.domain.Status;

import java.time.LocalDateTime;

public record EventUpdateRequest(
        String title,
        String description,
        String location,
        LocalDateTime startAt,
        LocalDateTime recruitStartAt,
        LocalDateTime recruitEndAt,
        Integer price,
        Integer maxTickets,
        Status status,
        String imageKey
) {
}
