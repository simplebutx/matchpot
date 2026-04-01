package com.ibmteam02.backend.event.controller;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/api/organizer/events")
    public ResponseEntity<Void> createEvent(@RequestBody EventCreateRequest dto,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        eventService.createEvent(dto, userDetails.getId());
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/api/organizer/events")
    public List<EventListResponse> getEvents(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return eventService.getEventList(userDetails.getId());
    }

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
