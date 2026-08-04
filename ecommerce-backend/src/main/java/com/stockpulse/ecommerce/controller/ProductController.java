package com.stockpulse.ecommerce.controller;

import com.stockpulse.ecommerce.dto.ProductDTO;
import com.stockpulse.ecommerce.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            return ResponseEntity.ok(productService.getAllProducts());
        } catch (Exception e) {
            log.error("Failed to fetch products: {}", e.getMessage());
            return ResponseEntity.status(503).body(
                    Map.of("error", "Service temporarily unavailable",
                           "message", "The inventory service is starting up. Please try again in a few seconds."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProduct(id));
        } catch (Exception e) {
            log.error("Failed to fetch product {}: {}", id, e.getMessage());
            return ResponseEntity.status(503).body(
                    Map.of("error", "Service temporarily unavailable",
                           "message", "The inventory service is starting up. Please try again in a few seconds."));
        }
    }
}
