package com.worksphere.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class HeaderSanitizationFilter implements GlobalFilter, Ordered {

    public static final String X_USER_ID = "X-User-Id";
    public static final String X_ORGANIZATION_ID = "X-Organization-Id";
    public static final String X_USER_ROLES = "X-User-Roles";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Strip any spoofed caller headers incoming from browser clients
        ServerHttpRequest sanitizedRequest = exchange.getRequest().mutate()
                .headers(headers -> {
                    headers.remove(X_USER_ID);
                    headers.remove(X_ORGANIZATION_ID);
                    headers.remove(X_USER_ROLES);
                })
                .build();

        return chain.filter(exchange.mutate().request(sanitizedRequest).build());
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 1;
    }
}
