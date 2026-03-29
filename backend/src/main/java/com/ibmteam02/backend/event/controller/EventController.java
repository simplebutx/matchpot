package com.ibmteam02.backend.event.controller;

import com.ibmteam02.backend.event.dto.EventCreateRequest;
import com.ibmteam02.backend.event.dto.EventListResponse;
import com.ibmteam02.backend.event.dto.EventUpdateRequest;
import com.ibmteam02.backend.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/api/organizer/events")
    public ResponseEntity<Void> createEvent(@RequestBody EventCreateRequest dto) {
        eventService.createEvent(dto);
        return ResponseEntity.status(201).build();
    }

//    @GetMapping("/api/organizer/events")
//    public List<EventListResponse> getEvents() {
//        return eventService.getEventList();
//    }

    @PutMapping("/api/organizer/events/{eventId}")
    public ResponseEntity<Void> updateEvent(@PathVariable Long eventId, @RequestBody EventUpdateRequest dto) {
        eventService.updateEvent(eventId, dto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/organizer/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
