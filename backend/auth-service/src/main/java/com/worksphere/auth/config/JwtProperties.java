package com.worksphere.auth.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "worksphere.jwt")
@Data
public class JwtProperties {
    private String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private long accessTokenExpirationMs = 900000;      // 15 minutes
    private long refreshTokenExpirationMs = 604800000;  // 7 days
    private String issuer = "worksphere-engine";
}
