package com.ibmteam02.backend.review.repository;

import com.ibmteam02.backend.review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByEventIdOrderByCreatedAtDesc(Long eventId);

    Optional<Review> findByIdAndEventId(Long reviewId, Long eventId);
}
