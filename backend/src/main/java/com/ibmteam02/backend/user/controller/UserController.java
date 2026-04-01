package com.ibmteam02.backend.user.controller;

import com.ibmteam02.backend.user.dto.MyPageResponse;
import com.ibmteam02.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    // 마이페이지
    @GetMapping("/api/me")
    public MyPageResponse getMyPage(@AuthenticationPrincipal User user) {
        return new MyPageResponse(user.getUsername());
    }
//
//    // 내가구매한 티켓목록
//    @GetMapping("/api/me/tickets")
//
//    // 티켓 구매하기
//    @PostMapping("/api/events/{eventId}/tickets")
//
//    // 티켓 구매 취소
//    @DeleteMapping("/api/me/tickets/{ticketId}")
}
