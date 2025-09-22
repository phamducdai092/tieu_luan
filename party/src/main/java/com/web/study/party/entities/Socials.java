package com.web.study.party.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "socials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Socials {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;

    private String name;
    private String url;
    private String icon;
}
