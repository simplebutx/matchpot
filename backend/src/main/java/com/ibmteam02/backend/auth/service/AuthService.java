package com.ibmteam02.backend.auth.service;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.auth.dto.JoinDto;
import com.ibmteam02.backend.auth.dto.LoginDto;
import com.ibmteam02.backend.auth.util.JwtUtil;
import com.ibmteam02.backend.global.exception.DuplicateEmailException;
import com.ibmteam02.backend.global.exception.EmailNotVerifiedException;
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
    private final MailService mailService;

    @Transactional
    public void signup(JoinDto joinDto) {
        if (userRepository.existsByEmail(joinDto.getEmail())) {
            throw new DuplicateEmailException();
        }

        if (!mailService.isVerified(joinDto.getEmail())) {
            throw new EmailNotVerifiedException();
        }

        User user = User.builder()
                .email(joinDto.getEmail())
                .password(passwordEncoder.encode(joinDto.getPassword()))
                .displayName(joinDto.getDisplayName())
                .role("ROLE_USER")
                .build();

        userRepository.save(user);
    }

    @Transactional
    public String login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("아이디가 존재하지 않습니다."));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new LoginFailedException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("회원을 찾을 수 없습니다."));

        return new CustomUserDetails(user);
    }
}
