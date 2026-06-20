package com.stockpulse.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long id,
    LocalDateTime orderDate,
    String status,
    BigDecimal totalAmount,
    List<OrderItemResponse> items
) {}
