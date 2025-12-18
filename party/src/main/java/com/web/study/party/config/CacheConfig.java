package com.web.study.party.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Spring Boot tự động config RedisCacheManager nếu thấy thư viện redis
}