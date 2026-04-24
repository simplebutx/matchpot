package com.ibmteam02.backend.admin.service;

import com.ibmteam02.backend.ai.service.AiService;
import com.ibmteam02.backend.global.exception.ReviewNotFoundException;
import com.ibmteam02.backend.review.domain.Review;
import com.ibmteam02.backend.review.repository.ReviewRepository;
import com.ibmteam02.backend.user.dto.AdminUserSummaryResponse;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final AiService aiService;

    @Transactional(readOnly = true)
    public List<AdminUserSummaryResponse> getAdminUserSummaries() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(user -> user.getDisplayName() == null ? "" : user.getDisplayName()))
                .map(user -> new AdminUserSummaryResponse(
                        user.getDisplayName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        Long eventId = review.getEvent().getId();
        reviewRepository.delete(review);

        try {
            aiService.analyzeReviews(eventId);
        } catch (Exception ignored) {
            // Keep admin delete successful even if the AI service is temporarily unavailable.
        }
    }
}
