package com.ibmteam02.backend.event.repository;

import com.ibmteam02.backend.event.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
     List<Event> findAllByUserId(Long userId);

    List<Event> findAllByOrderByCreatedAtDesc();
}
