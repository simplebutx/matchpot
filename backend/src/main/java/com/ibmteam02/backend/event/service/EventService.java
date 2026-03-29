package com.ibmteam02.backend.event.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.global.exception.EventNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    // 이벤트 생성
    @Transactional
    public void createEvent(EventCreateRequest dto) {
        Event event = new Event(dto.title(), dto.description(), dto.location(),
                dto.startAt(), dto.recruitStartAt(), dto.recruitEndAt(),
                dto.price(), dto.status(), dto.imageKey());

        eventRepository.save(event);
    }

    // 이벤트 목록 불러오기
//    @Transactional(readOnly = true)
//    public List<EventListResponse> getEventList() {
//        List<Event> events = eventRepository.findAllByAuthorId()
//                .stream().map(event -> new EventListResponse(
//                        event.getId(),
//                        event.getTitle(),
//                        event.getLocation(),
//                        event.getStartAt(),
//                        event.getPrice(),
//                        event.getStatus(),
//                        event.getImageKey()
//                ))
//                .toList();
//    }

    // 이벤트 수정
    @Transactional
    public void updateEvent(Long eventId, EventUpdateRequest dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new EventNotFoundException());

        // 권한 체크

        event.update(dto.title(), dto.description(), dto.location(),
                dto.startAt(), dto.recruitStartAt(), dto.recruitEndAt(),
                dto.price(), dto.status(), dto.imageKey());
    }

    // 이벤트 삭제
    @Transactional
    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new EventNotFoundException());

        // 권한 체크
        eventRepository.delete(event);
    }
}
