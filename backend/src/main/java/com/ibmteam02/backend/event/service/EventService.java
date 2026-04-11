package com.ibmteam02.backend.event.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
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

    // 이벤트 생성
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

    // 나의 이벤트 목록 불러오기
    @Transactional(readOnly = true)
    public List<EventListResponse> getEventList(Long userId) {
        List<Event> events = eventRepository.findAllByUserId(userId);

        String s3BaseUrl = "https://ibmteam2-s3-admin.s3.ap-northeast-2.amazonaws.com/";

    return events.stream().map(event -> {
        Integer soldcount = ticketRepository.sumQuantityByEventId(event.getId());
        if(soldcount==null) soldcount=0;

        int max = (event.getMaxTickets() !=null)? event.getMaxTickets():0;
        int remaining = max - soldcount;

        String fullImageUrl = (event.getImageKey() != null) ? s3BaseUrl + event.getImageKey() : null;

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
                        remaining,
                        event.getStatus(),
                        fullImageUrl,
                        event.getUser().getDisplayName()
            );
                }).toList();
    }

    //전체 이벤트 목록 불러오기
    public List<EventListResponse> getAllEvents() {
        return eventRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(EventListResponse::new)
                .toList();
    }

    // 이벤트 수정
    @Transactional
    public void updateEvent(Long eventId, EventUpdateRequest dto, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        if (!event.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 수정할 수 있습니다.");
        }

        event.update(dto.title(), dto.description(), dto.location(),
                dto.startAt(),dto.endAt(), dto.recruitStartAt(), dto.recruitEndAt(),
                dto.price(),dto.maxTickets(), dto.status(), dto.imageKey());
    }

    // 이벤트 삭제
    @Transactional
    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        if (!event.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 삭제할 수 있습니다.");
        }

        eventRepository.delete(event);
    }
}
