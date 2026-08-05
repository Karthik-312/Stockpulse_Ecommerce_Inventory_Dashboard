package com.stockpulse.ecommerce.dto;

import java.math.BigDecimal;

public record ProductDTO(
    Long id,
    String name,
    String sku,
    String category,
    int currentStock,
    String status,
    BigDecimal price,
    BigDecimal finalPrice,
    double discountPercentage,
    boolean inStock
) {}
