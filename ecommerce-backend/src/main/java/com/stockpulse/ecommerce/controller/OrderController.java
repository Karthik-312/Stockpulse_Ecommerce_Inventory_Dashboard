package com.stockpulse.ecommerce.controller;

import com.stockpulse.ecommerce.dto.OrderResponse;
import com.stockpulse.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(Authentication auth) {
        return ResponseEntity.ok(orderService.checkout(auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getOrders(auth.getName()));
    }
}
