package com.worksphere.auth;

import com.worksphere.auth.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthLifecycleIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private static String savedAccessToken;
    private static String savedRefreshToken;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        restTemplate.getRestTemplate().setRequestFactory(new org.springframework.http.client.JdkClientHttpRequestFactory());
    }

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/v1/auth";
    }

    @Test
    @Order(1)
    @DisplayName("1. E2E: Register new user with company workspace")
    void testRegisterNewUser() {
        RegisterRequest request = RegisterRequest.builder()
                .email("founder@worksphere.io")
                .password("StrongPassword123!")
                .firstName("Elena")
                .lastName("Rostova")
                .organizationName("WorkSphere HQ")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Correlation-Id", "corr-test-reg-001");

        HttpEntity<RegisterRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ApiResponse<AuthResponse>> response = restTemplate.exchange(
                getBaseUrl() + "/register",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        AuthResponse authData = response.getBody().getData();
        assertNotNull(authData);
        assertNotNull(authData.getAccessToken());
        assertNotNull(authData.getRefreshToken());
        assertEquals("founder@worksphere.io", authData.getUser().getEmail());
        assertEquals("Elena", authData.getUser().getFirstName());
        assertTrue(authData.getUser().getRoles().contains("ROLE_COMPANY_OWNER"));

        savedAccessToken = authData.getAccessToken();
        savedRefreshToken = authData.getRefreshToken();
    }

    @Test
    @Order(2)
    @DisplayName("2. E2E: Reject duplicate email registration with 409 Conflict")
    void testDuplicateRegistration() {
        RegisterRequest duplicate = RegisterRequest.builder()
                .email("founder@worksphere.io")
                .password("AnotherPassword456!")
                .firstName("Elena")
                .lastName("Duplicate")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RegisterRequest> entity = new HttpEntity<>(duplicate, headers);

        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                getBaseUrl() + "/register",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("DUPLICATE_EMAIL", response.getBody().getErrorCode());
    }

    @Test
    @Order(3)
    @DisplayName("3. E2E: Successful login with correct credentials")
    void testLoginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .email("founder@worksphere.io")
                .password("StrongPassword123!")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ApiResponse<AuthResponse>> response = restTemplate.exchange(
                getBaseUrl() + "/login",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        AuthResponse authData = response.getBody().getData();
        assertNotNull(authData.getAccessToken());
        assertNotNull(authData.getRefreshToken());

        // Update token for subsequent steps
        savedAccessToken = authData.getAccessToken();
        savedRefreshToken = authData.getRefreshToken();
    }

    @Test
    @Order(4)
    @DisplayName("4. E2E: Reject login with incorrect password with 401 Unauthorized")
    void testLoginWrongPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("founder@worksphere.io")
                .password("WrongPassword999!")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                getBaseUrl() + "/login",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("INVALID_CREDENTIALS", response.getBody().getErrorCode());
    }

    @Test
    @Order(5)
    @DisplayName("5. E2E: Access protected /me endpoint with valid Bearer token")
    void testGetAuthenticatedUserProfile() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + savedAccessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<ApiResponse<UserDto>> response = restTemplate.exchange(
                getBaseUrl() + "/me",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        UserDto user = response.getBody().getData();
        assertNotNull(user);
        assertEquals("founder@worksphere.io", user.getEmail());
        assertEquals("Elena", user.getFirstName());
        assertEquals("Rostova", user.getLastName());
    }

    @Test
    @Order(6)
    @DisplayName("6. E2E: Rotate access token using valid refresh token")
    void testRefreshToken() {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken(savedRefreshToken)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RefreshTokenRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ApiResponse<AuthResponse>> response = restTemplate.exchange(
                getBaseUrl() + "/refresh",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        AuthResponse authData = response.getBody().getData();
        assertNotNull(authData.getAccessToken());
        assertNotEquals(savedAccessToken, authData.getAccessToken()); // A new token was issued

        savedAccessToken = authData.getAccessToken();
    }

    @Test
    @Order(7)
    @DisplayName("7. E2E: Logout user, revoke refresh token, and blacklist access token")
    void testLogoutAndBlacklist() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + savedAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken(savedRefreshToken)
                .build();

        HttpEntity<RefreshTokenRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                getBaseUrl() + "/logout",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        // Now, attempt to call /me using the revoked token -> must be rejected with 401
        HttpHeaders verifyHeaders = new HttpHeaders();
        verifyHeaders.set("Authorization", "Bearer " + savedAccessToken);

        HttpEntity<Void> verifyEntity = new HttpEntity<>(verifyHeaders);

        ResponseEntity<String> verifyResponse = restTemplate.exchange(
                getBaseUrl() + "/me",
                HttpMethod.GET,
                verifyEntity,
                String.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, verifyResponse.getStatusCode());
    }
}
