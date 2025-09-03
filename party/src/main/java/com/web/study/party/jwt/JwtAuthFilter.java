package com.web.study.party.jwt;

import com.web.study.party.repositories.UserRepo;
import com.web.study.party.config.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepo userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        String token = header.substring(7);
        try {
            var jws = jwtService.getClaims(token);

            // (Optional) Nếu muốn chỉ cho phép access token:
            // if (!"access".equals(jws.getPayload().get("type"))) {
            //     chain.doFilter(req, res);
            //     return;
            // }

            String userId = jws.getPayload().getSubject();
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                userRepository.findById((int) Long.parseLong(userId)).ifPresent(u -> {
                    var cud = new CustomUserDetails(u);
                    var auth = new UsernamePasswordAuthenticationToken(
                            cud, null, cud.getAuthorities()
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
            }
        } catch (io.jsonwebtoken.JwtException ignored) {
            // token invalid/expired -> để entry point xử lý
        }
        chain.doFilter(req, res);
    }
}
