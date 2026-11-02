package com.worksphere.auth.service;

import com.worksphere.auth.config.JwtProperties;
import com.worksphere.auth.dto.AuthResponse;
import com.worksphere.auth.dto.LoginRequest;
import com.worksphere.auth.dto.RegisterRequest;
import com.worksphere.auth.dto.UserDto;
import com.worksphere.auth.entity.RefreshToken;
import com.worksphere.auth.entity.User;
import com.worksphere.auth.entity.UserCredential;
import com.worksphere.auth.entity.UserStatus;
import com.worksphere.auth.exception.DuplicateEmailException;
import com.worksphere.auth.exception.InvalidCredentialsException;
import com.worksphere.auth.exception.TokenValidationException;
import com.worksphere.auth.exception.UserNotFoundException;
import com.worksphere.auth.exception.UserSuspendedException;
import com.worksphere.auth.repository.RefreshTokenRepository;
import com.worksphere.auth.repository.UserCredentialRepository;
import com.worksphere.auth.repository.UserRepository;
import com.worksphere.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserCredentialRepository credentialRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException("An account with email " + normalizedEmail + " already exists");
        }

        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        if (StringUtils.hasText(request.getOrganizationName())) {
            roles.add("ROLE_COMPANY_OWNER");
        }

        User user = User.builder()
                .email(normalizedEmail)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .status(UserStatus.ACTIVE)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        UserCredential credential = UserCredential.builder()
                .user(savedUser)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        credentialRepository.save(credential);
        log.info("Registered new user: {} with ID: {}", savedUser.getEmail(), savedUser.getId());

        String accessToken = jwtTokenProvider.generateAccessToken(savedUser);
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser);

        saveRefreshToken(savedUser, refreshToken);

        return buildAuthResponse(savedUser, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UserSuspendedException("Account status is " + user.getStatus() + ". Please contact support.");
        }

        UserCredential credential = credentialRepository.findByUserId(user.getId())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), credential.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        saveRefreshToken(user, refreshToken);
        log.info("User logged in successfully: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String rawRefreshToken) {
        if (!jwtTokenProvider.validateToken(rawRefreshToken)) {
            throw new TokenValidationException("Invalid or expired refresh token");
        }

        String tokenHash = hashToken(rawRefreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenValidationException("Refresh token not found or already revoked"));

        log.info("Checking stored refresh token: revoked={}, expiresAt={}, now={}",
                storedToken.isRevoked(), storedToken.getExpiresAt(), Instant.now());

        if (storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenValidationException("Refresh token has expired or was revoked");
        }

        User user = storedToken.getUser();
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UserSuspendedException("Account status is " + user.getStatus());
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getAccessTokenExpirationMs() / 1000)
                .user(mapToDto(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(String accessToken, String rawRefreshToken) {
        if (StringUtils.hasText(accessToken)) {
            jwtTokenProvider.blacklistToken(accessToken);
        }

        if (StringUtils.hasText(rawRefreshToken)) {
            String tokenHash = hashToken(rawRefreshToken);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
            });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return mapToDto(user);
    }

    private void saveRefreshToken(User user, String rawToken) {
        String tokenHash = hashToken(rawToken);
        Instant expiresAt = Instant.now().plusMillis(jwtProperties.getRefreshTokenExpirationMs());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getAccessTokenExpirationMs() / 1000)
                .user(mapToDto(user))
                .build();
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .status(user.getStatus().name())
                .roles(user.getRoles())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
