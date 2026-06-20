package com.stockpulse.ecommerce.dto;

import java.math.BigDecimal;

public record CartItemResponse(
    Long id,
    Long inventoryItemId,
    String productName,
    int quantity,
    BigDecimal price,
    BigDecimal subtotal
) {}
