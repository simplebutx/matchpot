package com.ibmteam02.backend.review.dto;

import java.util.List;

public record ReviewListResponse(
        String sentiment,
        List<ReviewResponse> reviews
) {
}
