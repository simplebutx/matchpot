package com.ibmteam02.backend.event.controller;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventDetailResponse;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    public ResponseEntity<Page<EventListResponse>> getMyEvents(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 8, sort = "createdAt",direction = Sort.Direction.DESC) Pageable pageable) {

        Page<EventListResponse> responses = eventService.getEventList(userDetails.getId(),pageable);
        return ResponseEntity.ok(responses);
    }

    //이벤트 수정하기
    @PutMapping("/api/organizer/events/{eventId}")
    public ResponseEntity<Void> updateEvent(@PathVariable Long eventId, @RequestBody EventUpdateRequest dto,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        eventService.updateEvent(eventId, dto, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    //이벤트 삭제하기
    @DeleteMapping("/api/organizer/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        eventService.deleteEvent(eventId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }


    // 모든 이벤트 목록 조회
    @GetMapping("/api/events")
    public Page<EventListResponse> getAllEvents(
            @PageableDefault(size = 8,sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return eventService.getAllEvents(pageable);
    }

    //이벤트 상세 조회
    @GetMapping("/api/events/{eventId}")
    public EventDetailResponse getEventDetail(@PathVariable Long eventId) {
        return eventService.getEventDetail(eventId);
    }

    //이벤트 제목 검색
    @GetMapping("/api/events/searchTitle")
    public ResponseEntity<Page<EventListResponse>> searchEventTitle(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault (size = 8, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ){
        return ResponseEntity.ok(eventService.searchEventTitle(keyword, pageable));
    }
}
