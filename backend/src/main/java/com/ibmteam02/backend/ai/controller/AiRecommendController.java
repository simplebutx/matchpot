package com.ibmteam02.backend.ai.controller;

import com.ibmteam02.backend.ai.service.AiRecommendService;
import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/ai")
@RequiredArgsConstructor
public class AiRecommendController {
    private final AiRecommendService aiRecommendService;

    @GetMapping("/recommend")
    public ResponseEntity<?> getRecommend(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        System.out.println("🚩 [1] 컨트롤러 진입 성공");
        Long currentUserId = userDetails.getId();

        System.out.println("🚩 [백엔드] 인증된 유저 ID: " + currentUserId);

        return ResponseEntity.ok(aiRecommendService.getRecommendations(currentUserId));
    }
}
