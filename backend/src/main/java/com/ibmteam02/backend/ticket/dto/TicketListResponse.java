package com.ibmteam02.backend.ticket.dto;

import com.ibmteam02.backend.ticket.domain.Ticket;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TicketListResponse {
    private Long ticketId;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventStartAt;
    private String imageKey;
    private Integer quantity;

    public TicketListResponse(Ticket ticket) {
        this.ticketId = ticket.getId();
        this.eventId = ticket.getEvent().getId();
        this.eventTitle = ticket.getEvent().getTitle();
        this.eventLocation = ticket.getEvent().getLocation();
        this.eventStartAt = ticket.getEvent().getStartAt();
        this.quantity = ticket.getQuantity();
    }

    public TicketListResponse(Ticket ticket, String fullImageUrl) {
        this.ticketId = ticket.getId();
        this.eventId = ticket.getEvent().getId();
        this.eventTitle = ticket.getEvent().getTitle();
        this.eventLocation = ticket.getEvent().getLocation();
        this.eventStartAt = ticket.getEvent().getStartAt();
        this.quantity = ticket.getQuantity();
        this.imageKey = fullImageUrl;
    }
}
