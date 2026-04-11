package com.ibmteam02.backend.event.dto;

import com.ibmteam02.backend.event.domain.Status;

import java.time.LocalDateTime;

public record EventCreateRequest(
        String title,
        String description,
        String location,

        @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        java.time.LocalDateTime startAt,

        @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        java.time.LocalDateTime endAt,

        @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        java.time.LocalDateTime recruitStartAt,

        @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        java.time.LocalDateTime recruitEndAt,

        Integer price,
        Integer maxTickets,
        Status status,
        String imageKey
) {
}
