package com.worksphere.auth.service;

import com.worksphere.auth.config.JwtProperties;
import com.worksphere.auth.dto.AuthResponse;
import com.worksphere.auth.dto.LoginRequest;
import com.worksphere.auth.dto.RegisterRequest;
import com.worksphere.auth.entity.RefreshToken;
import com.worksphere.auth.entity.User;
import com.worksphere.auth.entity.UserCredential;
import com.worksphere.auth.entity.UserStatus;
import com.worksphere.auth.exception.DuplicateEmailException;
import com.worksphere.auth.exception.InvalidCredentialsException;
import com.worksphere.auth.exception.UserSuspendedException;
import com.worksphere.auth.repository.RefreshTokenRepository;
import com.worksphere.auth.repository.UserCredentialRepository;
import com.worksphere.auth.repository.UserRepository;
import com.worksphere.auth.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserCredentialRepository credentialRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private UserCredential testCredential;

    @BeforeEach
    void setUp() {
        UUID userId = UUID.randomUUID();
        testUser = User.builder()
                .id(userId)
                .email("alex@acmecorp.com")
                .firstName("Alex")
                .lastName("Morgan")
                .status(UserStatus.ACTIVE)
                .roles(Set.of("ROLE_USER", "ROLE_COMPANY_OWNER"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        testCredential = UserCredential.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .passwordHash("$2a$12$hashedPasswordExample")
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user and return tokens")
    void testRegisterSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .email("alex@acmecorp.com")
                .password("Secur3P@ssword")
                .firstName("Alex")
                .lastName("Morgan")
                .organizationName("Acme Global")
                .build();

        when(userRepository.existsByEmail("alex@acmecorp.com")).thenReturn(false);
        when(passwordEncoder.encode("Secur3P@ssword")).thenReturn("$2a$12$hashedPasswordExample");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(credentialRepository.save(any(UserCredential.class))).thenReturn(testCredential);
        when(jwtTokenProvider.generateAccessToken(any(User.class))).thenReturn("mock-access-token");
        when(jwtTokenProvider.generateRefreshToken(any(User.class))).thenReturn("mock-refresh-token");
        when(jwtProperties.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(jwtProperties.getAccessTokenExpirationMs()).thenReturn(900000L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals("alex@acmecorp.com", response.getUser().getEmail());

        verify(userRepository).save(any(User.class));
        verify(credentialRepository).save(any(UserCredential.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("Should throw DuplicateEmailException when email already exists")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .email("alex@acmecorp.com")
                .password("Secur3P@ssword")
                .firstName("Alex")
                .lastName("Morgan")
                .build();

        when(userRepository.existsByEmail("alex@acmecorp.com")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void testLoginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .email("alex@acmecorp.com")
                .password("Secur3P@ssword")
                .build();

        when(userRepository.findByEmail("alex@acmecorp.com")).thenReturn(Optional.of(testUser));
        when(credentialRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(testCredential));
        when(passwordEncoder.matches("Secur3P@ssword", testCredential.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("new-access-token");
        when(jwtTokenProvider.generateRefreshToken(testUser)).thenReturn("new-refresh-token");
        when(jwtProperties.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(jwtProperties.getAccessTokenExpirationMs()).thenReturn(900000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("new-access-token", response.getAccessToken());
        assertEquals("new-refresh-token", response.getRefreshToken());
        assertEquals("alex@acmecorp.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when password does not match")
    void testLoginInvalidPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("alex@acmecorp.com")
                .password("WrongPassword")
                .build();

        when(userRepository.findByEmail("alex@acmecorp.com")).thenReturn(Optional.of(testUser));
        when(credentialRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(testCredential));
        when(passwordEncoder.matches("WrongPassword", testCredential.getPasswordHash())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Should throw UserSuspendedException when account is suspended")
    void testLoginSuspendedUser() {
        testUser.setStatus(UserStatus.SUSPENDED);
        LoginRequest request = LoginRequest.builder()
                .email("alex@acmecorp.com")
                .password("Secur3P@ssword")
                .build();

        when(userRepository.findByEmail("alex@acmecorp.com")).thenReturn(Optional.of(testUser));

        assertThrows(UserSuspendedException.class, () -> authService.login(request));
    }
}
