package com.web.study.party.config;

import com.web.study.party.jwt.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;

    // 1. Đăng ký Endpoint (Đây là phần bị thiếu gây ra lỗi "No handlers")
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cho phép mọi nguồn (CORS)
                .withSockJS(); // Fallback cho trình duyệt cũ
    }

    // 2. Cấu hình Broker (Định tuyến tin nhắn)
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Server gửi về client qua các prefix này
        config.enableSimpleBroker("/topic", "/queue");
        // Client gửi lên server qua prefix này
        config.setApplicationDestinationPrefixes("/app");
    }

    // 3. Interceptor để xác thực Token (Phần bảo mật)
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        try {
                            // Validate Token
                            Jws<Claims> jws = jwtService.getClaims(token);
                            String email = jws.getPayload().getSubject();

                            // Tạo Authentication
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_USER"))
                            );

                            // Set vào Context
                            accessor.setUser(auth);
                            SecurityContextHolder.getContext().setAuthentication(auth);

                            log.info("✅ WS Authenticated user: {}", email);

                        } catch (Exception e) {
                            log.error("❌ WS Authentication failed: {}", e.getMessage());
                        }
                    }
                }
                return message;
            }
        });
    }
}