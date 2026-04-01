package com.ibmteam02.backend.event.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.global.exception.EventNotFoundException;
import com.ibmteam02.backend.global.exception.NoPermissionException;
import com.ibmteam02.backend.global.exception.UserNotFoundException;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    // 이벤트 생성
    @Transactional
    public void createEvent(EventCreateRequest dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()->new UserNotFoundException());

        Event event = new Event(dto.title(), dto.description(), dto.location(),
                dto.startAt(), dto.recruitStartAt(), dto.recruitEndAt(),
                dto.price(), dto.status(), dto.imageKey(), user);

        eventRepository.save(event);
    }

    // 이벤트 목록 불러오기
    @Transactional(readOnly = true)
    public List<EventListResponse> getEventList(Long userId) {
        List<Event> events = eventRepository.findAllByUserId(userId);

           return events.stream().map(event -> new EventListResponse(
                        event.getId(),
                        event.getTitle(),
                        event.getLocation(),
                        event.getStartAt(),
                        event.getPrice(),
                        event.getStatus(),
                        event.getImageKey(),
                        event.getUser().getDisplayName()
                ))
                .toList();
    }

    // 이벤트 수정
    @Transactional
    public void updateEvent(Long eventId, EventUpdateRequest dto, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new EventNotFoundException());

        if(!event.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 수정할 수 있습니다.");
        }

        event.update(dto.title(), dto.description(), dto.location(),
                dto.startAt(), dto.recruitStartAt(), dto.recruitEndAt(),
                dto.price(), dto.status(), dto.imageKey());
    }

    // 이벤트 삭제
    @Transactional
    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new EventNotFoundException());

        if(!event.getUser().getId().equals(userId)) {
            throw new NoPermissionException("작성자만 삭제할 수 있습니다.");
        }

        eventRepository.delete(event);
    }
}
