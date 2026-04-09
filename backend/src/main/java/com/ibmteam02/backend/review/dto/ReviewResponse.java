package com.ibmteam02.backend.review.dto;

import com.ibmteam02.backend.review.domain.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long eventId,
        Long userId,
        String authorName,
        Integer rating,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getEvent().getId(),
                review.getUser().getId(),
                review.getUser().getDisplayName(),
                review.getRating(),
                review.getContent(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
