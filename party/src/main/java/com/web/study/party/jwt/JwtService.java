package com.web.study.party.jwt;

import com.web.study.party.entities.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final JwtProperties props;
    private SecretKey key;

    public JwtService(JwtProperties props) { this.props = props; }

    @PostConstruct
    void init() {
        this.key = Keys.hmacShaKeyFor(props.getSecret().getBytes());
    }

    public String generateAccessToken(Users user) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.getAccessMinutes(), ChronoUnit.MINUTES);
        return Jwts.builder()
                .issuer(props.getIssuer())
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)
                .compact();
    }

    public String issueRefreshToken(Users user, String jti) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.getRefreshDays(), ChronoUnit.DAYS);
        return Jwts.builder()
                .issuer(props.getIssuer())
                .subject(user.getId().toString())
                .id(jti)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claim("type", "refresh")
                .claim("email", user.getEmail())
                .claim("role",user.getRole().name())
                .signWith(key)
                .compact();
    }

    public String extractUserId(String token) {
        return getClaims(token).getPayload().getSubject();
    }

    public Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }

    public boolean isAccess(Jws<Claims> jws) { return "access".equals(jws.getPayload().get("type")); }
    public boolean isRefresh(Jws<Claims> jws) { return "refresh".equals(jws.getPayload().get("type")); }

    public String newJti() { return UUID.randomUUID().toString(); }
}
