package com.ibmteam02.backend.auth.controller;

import com.ibmteam02.backend.auth.dto.JoinDto;
import com.ibmteam02.backend.auth.dto.LoginDto;
import com.ibmteam02.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody JoinDto joinDto){
        authService.signup(joinDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDto loginDto){
        return authService.login(loginDto);
    }

}
