package com.ibmteam02.backend.ticket.controller;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("events/{eventId}/tickets")
    public ResponseEntity<String> buyTicket(
            @PathVariable Long eventId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getId();
        ticketService.buyTicket(userId,eventId,quantity);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
