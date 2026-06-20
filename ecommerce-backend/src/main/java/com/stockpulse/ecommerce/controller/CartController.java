package com.stockpulse.ecommerce.controller;

import com.stockpulse.ecommerce.dto.CartItemRequest;
import com.stockpulse.ecommerce.dto.CartItemResponse;
import com.stockpulse.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(Authentication auth,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(auth.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponse> updateQuantity(Authentication auth,
            @PathVariable Long id, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(auth.getName(), id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(Authentication auth, @PathVariable Long id) {
        cartService.removeFromCart(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
