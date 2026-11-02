package com.worksphere.auth.security;

import com.worksphere.auth.config.JwtProperties;
import com.worksphere.auth.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class JwtTokenProvider {

    private final JwtProperties properties;
    private final SecretKey signingKey;
    private final StringRedisTemplate redisTemplate;
    private final Set<String> localBlacklist = ConcurrentHashMap.newKeySet();

    public JwtTokenProvider(JwtProperties properties, @Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.properties = properties;
        this.redisTemplate = redisTemplate;
        this.signingKey = Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(properties.getAccessTokenExpirationMs());

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("roles", new ArrayList<>(user.getRoles()))
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .id(UUID.randomUUID().toString())
                .issuer(properties.getIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(properties.getRefreshTokenExpirationMs());

        return Jwts.builder()
                .subject(user.getId().toString())
                .id(UUID.randomUUID().toString())
                .issuer(properties.getIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            String jti = claims.getId();

            if (jti != null && isBlacklisted(jti)) {
                log.warn("Token with JTI {} is revoked / blacklisted", jti);
                return false;
            }

            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public UUID getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        return UUID.fromString(claims.getSubject());
    }

    public String getEmailFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("email", String.class);
    }

    public List<String> getRolesFromToken(String token) {
        Claims claims = getClaims(token);
        List<?> rawRoles = claims.get("roles", List.class);
        if (rawRoles == null) {
            return Collections.emptyList();
        }
        return rawRoles.stream().map(Object::toString).toList();
    }

    public void blacklistToken(String token) {
        try {
            Claims claims = getClaims(token);
            String jti = claims.getId();
            Date expiration = claims.getExpiration();
            long ttlSeconds = Math.max(0, (expiration.getTime() - System.currentTimeMillis()) / 1000);

            if (jti != null) {
                if (redisTemplate != null) {
                    try {
                        redisTemplate.opsForValue().set("blacklist:" + jti, "revoked", Duration.ofSeconds(ttlSeconds));
                    } catch (Exception e) {
                        log.warn("Redis unavailable for blacklisting token, falling back to in-memory set: {}", e.getMessage());
                        localBlacklist.add(jti);
                    }
                } else {
                    localBlacklist.add(jti);
                }
            }
        } catch (Exception e) {
            log.error("Failed to blacklist JWT: {}", e.getMessage());
        }
    }

    private boolean isBlacklisted(String jti) {
        if (redisTemplate != null) {
            try {
                return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jti));
            } catch (Exception e) {
                log.debug("Redis read failed for blacklist, checking in-memory set: {}", e.getMessage());
            }
        }
        return localBlacklist.contains(jti);
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
