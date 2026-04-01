package com.ibmteam02.backend.auth.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    private final SecretKey secretKey;
    @Value("${jwt.expiration:3600000}")
    private Long expiration;

    public JwtUtil(@Value("${jwt.secretKey}")String secret){
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    //토근 생성
    public String generateToken(String email,String role){
        return Jwts.builder()
                .subject(email)
                .claim("email",email)
                .claim("role",role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(secretKey)
                .compact();
    }

    //토큰 검증
    public boolean validateToken(String token){
        try{
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token", e);
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token", e);
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token", e);
        } catch (SecurityException e) {
            log.warn("Invalid JWT signature", e);
        } catch (IllegalArgumentException e) {
            log.warn("Empty or invalid JWT token", e);
        } catch (Exception e){
            log.error("Unexpected error while validating JWT token", e);
            return false;
        }
        return false;
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload() // [최신 방식] getBody() 대신 getPayload()
                .get("email", String.class);
    }
}
