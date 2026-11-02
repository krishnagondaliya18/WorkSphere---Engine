package com.worksphere.auth.service;

import com.worksphere.auth.dto.AuthResponse;
import com.worksphere.auth.dto.LoginRequest;
import com.worksphere.auth.dto.RegisterRequest;
import com.worksphere.auth.dto.UserDto;

import java.util.UUID;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String accessToken, String refreshToken);
    UserDto getCurrentUser(UUID userId);
}
