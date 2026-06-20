package com.stockpulse.ecommerce.dto;

public record InventoryItemDTO(
    Long id,
    String name,
    String sku,
    String category,
    int currentStock,
    int minThreshold,
    String status,
    Double price
) {}
