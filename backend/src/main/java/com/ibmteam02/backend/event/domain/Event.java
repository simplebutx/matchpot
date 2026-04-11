package com.ibmteam02.backend.event.domain;

import com.ibmteam02.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;   // 행사 제목
    private String description;   // 행사 설명(내용)
    private String location;     // 행사 위치
    private LocalDateTime startAt;     // 행사 시작 시간
    private LocalDateTime endAt;     // 행사 시작 시간
    private LocalDateTime recruitStartAt;   // 행사 모집 시작 시간
    private LocalDateTime recruitEndAt;    // 행사 모집 마감 시간
    private Integer price;

    @Column(nullable = true)
    private Integer maxTickets; // 등록 티켓 수량

    @Enumerated(EnumType.STRING)
    private Status status;    // 모집중/마감/종료
    private String imageKey;    // 이미지

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Event(String title, String description, String location, LocalDateTime startAt, LocalDateTime endAt, LocalDateTime recruitStartAt,
                 LocalDateTime recruitEndAt, Integer price,Integer maxTickets, Status status, String imageKey, User user) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.startAt = startAt;
        this.endAt = endAt;
        this.recruitStartAt = recruitStartAt;
        this.recruitEndAt = recruitEndAt;
        this.price = price;
        this.maxTickets = maxTickets;
        this.status = status;
        this.imageKey = imageKey;
        this.user = user;
    }

    public void update(String title, String description, String location, LocalDateTime startAt,LocalDateTime endAt, LocalDateTime recruitStartAt,
                       LocalDateTime recruitEndAt, Integer price,Integer maxTickets, Status status, String imageKey) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.startAt = startAt;
        this.endAt = endAt;
        this.recruitStartAt = recruitStartAt;
        this.recruitEndAt = recruitEndAt;
        this.price = price;
        this.maxTickets = maxTickets;
        this.status = status;
        this.imageKey = imageKey;
    }
}
