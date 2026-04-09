package com.klu.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {

    private final Map<String, Long> tokenStore = new ConcurrentHashMap<>();

    public String generateToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, userId);
        return token;
    }

    public Optional<Long> getUserIdForToken(String token) {
        return Optional.ofNullable(tokenStore.get(token));
    }

    public void revokeToken(String token) {
        tokenStore.remove(token);
    }
}
