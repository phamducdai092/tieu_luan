package com.web.study.party.entities;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Users recipient; // Người nhận (Owner/Mod)

    private String content;  // Nội dung: "A vừa xin vào nhóm B"
    private String link;     // Link để bấm vào: "/rooms/nhom-b/requests"
    private String type;     // JOIN_REQUEST, SYSTEM, ...

    @Builder.Default
    private boolean isRead = false; // Đã đọc chưa

    @Builder.Default
    private Instant createdAt = Instant.now();
}