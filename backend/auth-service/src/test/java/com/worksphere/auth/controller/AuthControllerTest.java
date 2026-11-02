package com.worksphere.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.worksphere.auth.dto.*;
import com.worksphere.auth.security.JwtAuthenticationFilter;
import com.worksphere.auth.security.JwtTokenProvider;
import com.worksphere.auth.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("POST /api/v1/auth/register should return 201 with AuthResponse")
    void testRegisterEndpoint() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("alex@acmecorp.com")
                .password("Secur3Password")
                .firstName("Alex")
                .lastName("Morgan")
                .organizationName("Acme Corp")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .expiresIn(900)
                .user(UserDto.builder()
                        .id(UUID.randomUUID())
                        .email("alex@acmecorp.com")
                        .firstName("Alex")
                        .lastName("Morgan")
                        .status("ACTIVE")
                        .roles(Set.of("ROLE_USER", "ROLE_COMPANY_OWNER"))
                        .createdAt(Instant.now())
                        .build())
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("mock-access-token"))
                .andExpect(jsonPath("$.data.user.email").value("alex@acmecorp.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login should return 200 with tokens")
    void testLoginEndpoint() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("alex@acmecorp.com")
                .password("Secur3Password")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .expiresIn(900)
                .user(UserDto.builder()
                        .id(UUID.randomUUID())
                        .email("alex@acmecorp.com")
                        .firstName("Alex")
                        .lastName("Morgan")
                        .status("ACTIVE")
                        .roles(Set.of("ROLE_USER"))
                        .build())
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("mock-access-token"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login with invalid email should return 400 Bad Request")
    void testLoginValidationFailure() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("not-an-email")
                .password("")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }
}
