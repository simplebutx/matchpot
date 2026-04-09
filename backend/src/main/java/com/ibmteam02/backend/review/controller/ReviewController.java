package com.ibmteam02.backend.review.controller;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.review.dto.ReviewCreateRequest;
import com.ibmteam02.backend.review.dto.ReviewResponse;
import com.ibmteam02.backend.review.dto.ReviewUpdateRequest;
import com.ibmteam02.backend.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/events/{eventId}/reviews")
    public List<ReviewResponse> getReviews(@PathVariable Long eventId) {
        return reviewService.getReviews(eventId);
    }

    @PostMapping("/api/events/{eventId}/reviews")
    public ResponseEntity<Void> createReview(
            @PathVariable Long eventId,
            @Valid @RequestBody ReviewCreateRequest dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.createReview(eventId, dto, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/api/events/{eventId}/reviews/{reviewId}")
    public ResponseEntity<Void> updateReview(
            @PathVariable Long eventId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewUpdateRequest dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.updateReview(eventId, reviewId, dto, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/events/{eventId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long eventId,
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.deleteReview(eventId, reviewId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
