package com.ibmteam02.backend.review.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.global.exception.EventNotFoundException;
import com.ibmteam02.backend.global.exception.NoPermissionException;
import com.ibmteam02.backend.global.exception.ReviewNotFoundException;
import com.ibmteam02.backend.global.exception.UserNotFoundException;
import com.ibmteam02.backend.review.domain.Review;
import com.ibmteam02.backend.review.dto.ReviewCreateRequest;
import com.ibmteam02.backend.review.dto.ReviewResponse;
import com.ibmteam02.backend.review.dto.ReviewUpdateRequest;
import com.ibmteam02.backend.review.repository.ReviewRepository;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new EventNotFoundException();
        }

        return reviewRepository.findAllByEventIdOrderByCreatedAtDesc(eventId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Transactional
    public void createReview(Long eventId, ReviewCreateRequest dto, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        Review review = new Review(dto.rating(), dto.content(), event, user);
        reviewRepository.save(review);
    }

    @Transactional
    public void updateReview(Long eventId, Long reviewId, ReviewUpdateRequest dto, Long userId) {
        Review review = reviewRepository.findByIdAndEventId(reviewId, eventId)
                .orElseThrow(ReviewNotFoundException::new);

        if (!review.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 리뷰를 수정할 수 있습니다.");
        }

        review.update(dto.rating(), dto.content());
    }

    @Transactional
    public void deleteReview(Long eventId, Long reviewId, Long userId) {
        Review review = reviewRepository.findByIdAndEventId(reviewId, eventId)
                .orElseThrow(ReviewNotFoundException::new);

        if (!review.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 리뷰를 삭제할 수 있습니다.");
        }

        reviewRepository.delete(review);
    }
}
