package com.ibmteam02.backend.ticket.service;

import com.ibmteam02.backend.event.domain.Event;
import com.ibmteam02.backend.event.repository.EventRepository;
import com.ibmteam02.backend.global.exception.EventNotFoundException;
import com.ibmteam02.backend.global.exception.NoPermissionException;
import com.ibmteam02.backend.global.exception.TicketNotFoundException;
import com.ibmteam02.backend.global.exception.TicketStockEmptyException;
import com.ibmteam02.backend.global.exception.UserNotFoundException;
import com.ibmteam02.backend.ticket.domain.Ticket;
import com.ibmteam02.backend.ticket.dto.TicketListResponse;
import com.ibmteam02.backend.ticket.repository.TicketRepository;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class TicketService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    @Value("${cloud.aws.s3.base-url}")
    private String s3BaseUrl;

    //사용자 티켓 구매
    @Transactional
    public void buyTicket(Long userId, Long eventId, Integer quantity ){
        User user = userRepository.findById(userId)
                .orElseThrow(()->new UserNotFoundException());

        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new EventNotFoundException());

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

    //티켓 내역 조회
    @Transactional(readOnly = true)
    public List<TicketListResponse> getMyTickets(Long userId) {
        List<Ticket> tickets = ticketRepository.findAllByUserId(userId);
        return tickets.stream()
                .map(ticket -> {
                    String imageKey = ticket.getEvent().getImageKey();

                    String fullImageUrl = buildImageUrl(imageKey);

                    return new TicketListResponse(ticket, fullImageUrl);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelTicket(Long userId, Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);

        if (!ticket.getUser().getId().equals(userId)) {
            throw new NoPermissionException("본인이 구매한 티켓만 취소할 수 있습니다.");
        }

        ticketRepository.delete(ticket);
    }

    private String buildImageUrl(String imageKey) {
        if (imageKey == null || imageKey.isBlank()) {
            return null;
        }
        if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) {
            return imageKey;
        }
        return s3BaseUrl + imageKey; // @Value("${cloud.aws.s3.url}") 등으로 주입받은 값
    }

}
