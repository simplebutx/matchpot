package com.ibmteam02.backend.ticket.controller;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.ticket.dto.TicketBuyRequest;
import com.ibmteam02.backend.ticket.dto.TicketListResponse;
import com.ibmteam02.backend.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TicketController {

    private final TicketService ticketService;

    //티켓 구매
    @PostMapping("events/{eventId}/tickets")
    public ResponseEntity<Void> buyTicket(
            @PathVariable Long eventId,
            @RequestBody TicketBuyRequest ticketBuyRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getId();
        ticketService.buyTicket(userId,eventId,ticketBuyRequest.getQuantity());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //내 티켓 내역 조회
    @GetMapping("/me/tickets")
    public ResponseEntity<List<TicketListResponse>> getMyTickets(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<TicketListResponse> responses = ticketService.getMyTickets(userDetails.getId());
        return ResponseEntity.ok(responses);
    }
}
