package com.ibmteam02.backend.review.dto;

import java.util.List;
import java.util.Map;

public record ReviewListResponse(
        String sentiment,
        Map<String, Double> sentimentPercentages,
        List<ReviewResponse> reviews
) {
}
