package com.web.study.party.jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {
    private String secret;
    private String issuer;
    private int accessMinutes;
    private int refreshDays;

    private String refreshCookieName = "refresh_token";
    private String refreshCookiePath = "/"; // chỉ gửi cho auth endpoints
    private String refreshCookieDomain;                // để trống nếu same-origin
    private String refreshCookieSameSite = "Lax";   // Strict|Lax|None
    private boolean refreshCookieSecure = false;        // true trên HTTPS
}
