package com.stockpulse.ecommerce.service;

import com.stockpulse.ecommerce.dto.InventoryItemDTO;
import com.stockpulse.ecommerce.dto.ProductDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    private final StockPulseClient stockPulseClient;

    public ProductService(StockPulseClient stockPulseClient) {
        this.stockPulseClient = stockPulseClient;
    }

    public List<ProductDTO> getAllProducts() {
        List<InventoryItemDTO> items = stockPulseClient.getAllInventoryItems();
        return items.stream().map(this::toProductDTO).toList();
    }

    public ProductDTO getProduct(Long id) {
        InventoryItemDTO item = stockPulseClient.getInventoryItem(id);
        return toProductDTO(item);
    }

    private ProductDTO toProductDTO(InventoryItemDTO item) {
        String status = item.status() != null ? item.status().toUpperCase() : "";
        boolean inStock = item.currentStock() > 0
                && !status.equals("OUT_OF_STOCK") && !status.equals("DISCONTINUED");

        BigDecimal price = item.price() != null ? BigDecimal.valueOf(item.price()) : null;

        return new ProductDTO(
                item.id(), item.name(), item.sku(), item.category(),
                item.currentStock(), item.status(), price, inStock
        );
    }
}
