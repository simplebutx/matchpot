package com.ibmteam02.backend.event.controller;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    //행사 등록
    @PostMapping(value = "/api/organizer/events", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createEvent(
            @RequestPart("dto") EventCreateRequest dto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {

        Long userId = userDetails.getId();
        eventService.createEvent(dto, userId, image);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //나의 이벤트 목록 불러오기(주최자)
    @GetMapping("/api/organizer/events")
    public List<EventListResponse> getEvents(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return eventService.getEventList(userDetails.getId());
    }

    // 고객용: 모든 주최자의 행사 전체 조회 (로그인 필요 없음)
    @GetMapping("/api/events")
    public List<EventListResponse> getAllEvents() {
        return eventService.getAllEvents();
    }

    //이벤트 수정하기
    @PutMapping("/api/organizer/events/{eventId}")
    public ResponseEntity<Void> updateEvent(@PathVariable Long eventId, @RequestBody EventUpdateRequest dto,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        eventService.updateEvent(eventId, dto, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/organizer/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        eventService.deleteEvent(eventId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
