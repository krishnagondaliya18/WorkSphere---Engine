package com.worksphere.auth.security;

import com.worksphere.auth.config.JwtProperties;
import com.worksphere.auth.entity.User;
import com.worksphere.auth.entity.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private JwtProperties properties;
    private User testUser;

    @BeforeEach
    void setUp() {
        properties = new JwtProperties();
        properties.setSecret("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        properties.setAccessTokenExpirationMs(60000);
        properties.setRefreshTokenExpirationMs(300000);
        properties.setIssuer("worksphere-test");

        jwtTokenProvider = new JwtTokenProvider(properties, null);

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("alex@worksphere.io")
                .firstName("Alex")
                .lastName("Morgan")
                .status(UserStatus.ACTIVE)
                .roles(Set.of("ROLE_USER", "ROLE_COMPANY_OWNER"))
                .build();
    }

    @Test
    @DisplayName("Should generate valid access token containing user claims")
    void testGenerateAccessToken() {
        String token = jwtTokenProvider.generateAccessToken(testUser);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(testUser.getId(), jwtTokenProvider.getUserIdFromToken(token));
        assertEquals(testUser.getEmail(), jwtTokenProvider.getEmailFromToken(token));

        List<String> roles = jwtTokenProvider.getRolesFromToken(token);
        assertTrue(roles.contains("ROLE_USER"));
        assertTrue(roles.contains("ROLE_COMPANY_OWNER"));
    }

    @Test
    @DisplayName("Should generate valid refresh token")
    void testGenerateRefreshToken() {
        String refreshToken = jwtTokenProvider.generateRefreshToken(testUser);

        assertNotNull(refreshToken);
        assertTrue(jwtTokenProvider.validateToken(refreshToken));
        assertEquals(testUser.getId(), jwtTokenProvider.getUserIdFromToken(refreshToken));
    }

    @Test
    @DisplayName("Should invalidate blacklisted token")
    void testBlacklistToken() {
        String token = jwtTokenProvider.generateAccessToken(testUser);
        assertTrue(jwtTokenProvider.validateToken(token));

        jwtTokenProvider.blacklistToken(token);
        assertFalse(jwtTokenProvider.validateToken(token));
    }

    @Test
    @DisplayName("Should reject malformed token")
    void testRejectMalformedToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.bearer.token"));
    }
}
