package com.ibmteam02.backend.event.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventDetailResponse;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.global.exception.EventNotFoundException;
import com.ibmteam02.backend.global.exception.NoPermissionException;
import com.ibmteam02.backend.global.exception.UserNotFoundException;
import com.ibmteam02.backend.global.service.S3Service;
import com.ibmteam02.backend.ticket.repository.TicketRepository;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final TicketRepository ticketRepository;

    @Value("${cloud.aws.s3.base-url}")
    private String s3BaseUrl;

    @Transactional
    public void createEvent(EventCreateRequest dto, Long userId, MultipartFile image) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        String imageKey = s3Service.uploadImage(image);

        Event event = new Event(
                dto.title(),
                dto.description(),
                dto.location(),
                dto.startAt(),
                dto.endAt(),
                dto.recruitStartAt(),
                dto.recruitEndAt(),
                dto.price(),
                dto.maxTickets(),
                dto.status(),
                imageKey,
                user
        );

        eventRepository.save(event);
    }

    //본인 이벤트 리스트 조회
    @Transactional(readOnly = true)
    public Page<EventListResponse> getEventList(Long userId, Pageable pageable) {
        Page<Event> eventPage = eventRepository.findAllByUserId(userId, pageable);

        return eventPage.map(event -> {
            Integer soldCount = ticketRepository.sumQuantityByEventId(event.getId());
            if (soldCount == null) {
                soldCount = 0;
            }

            int maxTickets = event.getMaxTickets() != null ? event.getMaxTickets() : 0;
            int remainingTickets = maxTickets - soldCount;

            return new EventListResponse(
                    event.getId(),
                    event.getTitle(),
                    event.getDescription(),
                    event.getLocation(),
                    event.getStartAt(),
                    event.getEndAt(),
                    event.getRecruitStartAt(),
                    event.getRecruitEndAt(),
                    event.getPrice(),
                    event.getMaxTickets(),
                    remainingTickets,
                    event.getStatus(),
                    buildImageUrl(event.getImageKey()),
                    event.getUser().getDisplayName()
            );
        });
    }

    //이벤트 수정
    @Transactional
    public void updateEvent(Long eventId, EventUpdateRequest dto, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        if (!event.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 수정할 수 있습니다.");
        }

        event.update(
                dto.title(),
                dto.description(),
                dto.location(),
                dto.startAt(),
                dto.endAt(),
                dto.recruitStartAt(),
                dto.recruitEndAt(),
                dto.price(),
                dto.maxTickets(),
                dto.status(),
                dto.imageKey()
        );
    }

    //이벤트 삭제
    @Transactional
    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        if (!event.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 삭제할 수 있습니다.");
        }

        eventRepository.delete(event);
    }

    //모든 이벤트 조회
    public Page<EventListResponse> getAllEvents(Pageable pageable) {
        Page<Event> eventPage = eventRepository.findAllByOrderByCreatedAtDesc(pageable);

        return eventPage.map(event -> new EventListResponse(
                        event.getId(),
                        event.getTitle(),
                        event.getDescription(),
                        event.getLocation(),
                        event.getStartAt(),
                        event.getEndAt(),
                        event.getRecruitStartAt(),
                        event.getRecruitEndAt(),
                        event.getPrice(),
                        event.getMaxTickets(),
                        event.getMaxTickets(),
                        event.getStatus(),
                        buildImageUrl(event.getImageKey()),
                        event.getUser().getDisplayName()
                ));
    }

    //이벤트 상세보기
    public EventDetailResponse getEventDetail(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        Integer soldCount = ticketRepository.sumQuantityByEventId(event.getId());
        if (soldCount == null) {
            soldCount = 0;
        }

        int maxTickets = event.getMaxTickets() != null ? event.getMaxTickets() : 0;
        int remainingTickets = maxTickets - soldCount;

        return new EventDetailResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getLocation(),
                event.getStartAt(),
                event.getEndAt(),
                event.getRecruitStartAt(),
                event.getRecruitEndAt(),
                event.getPrice(),
                event.getMaxTickets(),
                remainingTickets,
                event.getStatus(),
                buildImageUrl(event.getImageKey()),
                event.getUser().getDisplayName()
        );
    }

    private String buildImageUrl(String imageKey) {
        if (imageKey == null || imageKey.isBlank()) {
            return null;
        }

        if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) {
            return imageKey;
        }

        return s3BaseUrl + imageKey;
    }
}
