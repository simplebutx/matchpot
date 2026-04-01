package com.ibmteam02.backend.event.dto;

import com.ibmteam02.backend.event.domain.Status;
import com.ibmteam02.backend.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class EventListResponse {
    private Long id;
    private String title;
    private String location;
    private LocalDateTime startAt;
    private Integer price;
    private Status status;
    private String imageKey;
    private String authorName;
}
