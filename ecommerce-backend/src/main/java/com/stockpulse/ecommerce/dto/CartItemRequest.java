package com.stockpulse.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
    @NotNull Long inventoryItemId,
    @Min(1) int quantity
) {}
