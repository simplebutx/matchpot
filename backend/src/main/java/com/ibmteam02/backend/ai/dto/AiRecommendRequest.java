package com.ibmteam02.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AiRecommendRequest {
    private String userHistory;
    private List<EventInfo> allEvents;

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EventInfo {
        private Long id;
        private String title;
    }
}
