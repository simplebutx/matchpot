package com.ibmteam02.backend.event.repository;

import com.ibmteam02.backend.event.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
     Page<Event> findAllByUserId(Long userId, Pageable pageable);

    Page<Event> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword%")
    Page<Event> searchByTitleLike(@Param("keyword") String title, Pageable pageable);
}
