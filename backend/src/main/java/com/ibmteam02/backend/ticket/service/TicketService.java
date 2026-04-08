package com.ibmteam02.backend.ticket.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.global.exception.TicketStockEmptyException;
import com.ibmteam02.backend.ticket.domain.Ticket;
import com.ibmteam02.backend.ticket.repository.TicketRepository;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    //사용자 티켓 구매
    @Transactional
    public void buyTicket(Long userId, Long eventId, Integer quantity ){
        User user = userRepository.findById(userId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 회원입니다"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 행사입니다"));

        Integer soldTickets = ticketRepository.sumQuantityByEventId(eventId);
        if(soldTickets==null) {
            soldTickets = 0;
        }

        Integer maxTickets = event.getMaxTickets();
        if(maxTickets == null){
            maxTickets = 0;
        }

        if(soldTickets + quantity > maxTickets){
            throw new TicketStockEmptyException();
        }

        Ticket ticket = new Ticket(user,event,quantity);

        ticketRepository.save(ticket);

    }

}
