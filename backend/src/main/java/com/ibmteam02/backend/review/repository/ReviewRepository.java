package com.ibmteam02.backend.review.repository;

import com.ibmteam02.backend.review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
