package com.ibmteam02.backend.event.repository;

import com.ibmteam02.backend.event.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
     Page<Event> findAllByUserId(Long userId, Pageable pageable);

    Page<Event> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
