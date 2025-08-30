package com.web.study.party.jwt;

import com.web.study.party.repositories.UserRepo;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepo userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                var jws = jwtService.getClaims(token);
                String userId = jws.getPayload().getSubject();
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    userRepository.findById(Math.toIntExact(Long.parseLong(userId))).ifPresent(u -> {
                        var auth = new UsernamePasswordAuthenticationToken(
                                u,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()))
                        );
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    });
                }
            } catch (io.jsonwebtoken.JwtException ignored) {
                // token invalid/expired -> để entry point xử lý
            }
        }
        chain.doFilter(req, res);
    }
}
