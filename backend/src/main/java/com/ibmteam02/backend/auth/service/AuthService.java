package com.ibmteam02.backend.auth.service;

import com.ibmteam02.backend.auth.dto.JoinDto;
import com.ibmteam02.backend.auth.dto.LoginDto;
import com.ibmteam02.backend.auth.util.JwtUtil;
import com.ibmteam02.backend.global.exception.LoginFailedException;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    //회원가입 메서드
    @Transactional
    public void singup (JoinDto joinDto){
        if (userRepository.existsByUserName(joinDto.getUserName())) {
            throw new RuntimeException("이미 존재하는 아이디입니다");
        }

        User user = User.builder()
                .userName(joinDto.getUserName())
                .password(passwordEncoder.encode(joinDto.getPassword()))
                .displayName(joinDto.getDisplayName())
                .role("ROLE_USER")
                .build();

        userRepository.save(user);
    }

    //로그인 메서드
    public String login(LoginDto loginDto){
        User user = userRepository.findByUserName(loginDto.getUserName())
                .orElseThrow(()->new RuntimeException("아이디가 존재하지 않습니다"));

        if(!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())){
            throw new LoginFailedException("비밀번호가 일치하지 않습니다");
        }

        String token = jwtUtil.generateToken(user.getUserName(),user.getRole());

        return token;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username)
                .orElseThrow(()->new UsernameNotFoundException("회원이 아닙니다"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserName())
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();
    }
}
