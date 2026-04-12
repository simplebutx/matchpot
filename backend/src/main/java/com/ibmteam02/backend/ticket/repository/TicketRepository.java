package com.ibmteam02.backend.ticket.repository;

import com.ibmteam02.backend.ticket.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t JOIN FETCH t.event WHERE t.user.id = :userId")
    List<Ticket> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(t.quantity) FROM Ticket t WHERE t.event.id = :eventId")
    Integer sumQuantityByEventId(@Param("eventId") Long eventId);
}
