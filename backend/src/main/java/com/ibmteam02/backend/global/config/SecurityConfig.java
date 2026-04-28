package com.ibmteam02.backend.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibmteam02.backend.auth.handler.OAuth2SuccessHandler;
import com.ibmteam02.backend.auth.service.CustomOAuth2UserService;
import com.ibmteam02.backend.auth.util.JwtFilter;
import com.ibmteam02.backend.global.exception.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    // 인증이 안된 사용자가 보호된 API에 접근 시
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setCharacterEncoding("UTF-8");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getWriter(), new ErrorResponse(401, "로그인이 필요합니다."));
        };
    }

    // 인증은 되었지만 권한이 없는 사용자가 접근 시
    @Bean
    public AccessDeniedHandler accessDeniedHandler(ObjectMapper objectMapper) {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setCharacterEncoding("UTF-8");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getWriter(), new ErrorResponse(403, "접근 권한이 없습니다."));
        };
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            AuthenticationEntryPoint authenticationEntryPoint,
            AccessDeniedHandler accessDeniedHandler
    ) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler))
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/oauth2/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/login", "/api/auth/email-send", "/api/auth/email-verify").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/events", "/api/events/searchTitle", "/api/events/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/events/*/reviews").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/events/*/tickets").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/events/*/reviews").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/events/*/reviews/*").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/*/reviews/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/me/tickets").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/me/tickets/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/me").hasAnyRole("USER", "ORGANIZER")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/organizer/**").hasRole("ORGANIZER")
                        .requestMatchers("/api/me/**", "/api/ai/**").hasAnyRole("USER", "ORGANIZER")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin(frontendUrl);
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("Authorization");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
