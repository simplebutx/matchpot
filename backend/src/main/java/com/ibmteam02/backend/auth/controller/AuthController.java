package com.ibmteam02.backend.auth.controller;

import com.ibmteam02.backend.auth.dto.EmailRequestDto;
import com.ibmteam02.backend.auth.dto.JoinDto;
import com.ibmteam02.backend.auth.dto.LoginDto;
import com.ibmteam02.backend.auth.service.AuthService;
import com.ibmteam02.backend.auth.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final MailService mailService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody JoinDto joinDto){
        authService.signup(joinDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDto loginDto){
        return authService.login(loginDto);
    }

    @PostMapping("/email-send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequestDto emailRequestDto) {
        mailService.sendAuthCode(emailRequestDto.getEmail());
        return ResponseEntity.ok("이메일 인증은 현재 임시 비활성화 상태입니다.");
    }

    @PostMapping("/email-verify")
    public ResponseEntity<String> verifyEmail(@RequestBody EmailRequestDto emailRequestDto) {
        return ResponseEntity.ok("이메일 인증은 현재 임시 비활성화 상태입니다.");
    }
}
