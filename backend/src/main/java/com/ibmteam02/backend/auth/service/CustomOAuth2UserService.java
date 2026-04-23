package com.ibmteam02.backend.auth.service;

import com.ibmteam02.backend.auth.domain.CustomUserDetails;
import com.ibmteam02.backend.user.domain.User;
import com.ibmteam02.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if(email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Google account email not found.");
        }

        User user = userRepository.findByEmail(email)
                .map(existingUser -> normalizeUserRole(existingUser))
                .orElseGet(() -> userRepository.save(new User(email, "OAUTH2", name != null ? name : "GoogleUser")));

        return new CustomUserDetails(user, oAuth2User.getAttributes());

    }

    private User normalizeUserRole(User user) {
        if ("USER".equals(user.getRole())) {
            user.updateRole("ROLE_USER");
            return userRepository.save(user);
        }

        return user;
    }
}
