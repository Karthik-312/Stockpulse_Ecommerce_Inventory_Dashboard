package com.stockpulse.ecommerce.dto;

public record AuthResponse(
    String token,
    String email,
    String firstName,
    String lastName
) {}
