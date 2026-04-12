package com.ibmteam02.backend.ticket.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TicketBuyRequest {
    private Integer quantity;

    public TicketBuyRequest(Integer quantity) {
        this.quantity = quantity;
    }
}
