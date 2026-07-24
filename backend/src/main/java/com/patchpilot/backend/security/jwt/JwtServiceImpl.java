package com.patchpilot.backend.security.jwt;

import com.patchpilot.backend.config.JwtProperties;
import com.patchpilot.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {

    @Autowired
    private JwtProperties jwtProperties;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    public String generateToken(User user) {

        Date now = new Date();

        Date expiry = new Date(
                now.getTime() + jwtProperties.getExpiration()
        );

        return Jwts.builder()
                .subject(user.getGithubId().toString())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    @Override
    public Long extractGithubId(String token) {

        return Long.parseLong(
                extractClaims(token).getSubject()
        );
    }

    @Override
    public boolean isTokenValid(String token) {

        try {
            extractClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}