package com.stockpulse.ecommerce.service;

import com.stockpulse.ecommerce.dto.CartItemRequest;
import com.stockpulse.ecommerce.dto.CartItemResponse;
import com.stockpulse.ecommerce.dto.ProductDTO;
import com.stockpulse.ecommerce.model.CartItem;
import com.stockpulse.ecommerce.model.Customer;
import com.stockpulse.ecommerce.repository.CartItemRepository;
import com.stockpulse.ecommerce.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository,
                       CustomerRepository customerRepository,
                       ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productService = productService;
    }

    public List<CartItemResponse> getCart(String email) {
        Customer customer = findCustomer(email);
        return cartItemRepository.findByCustomer(customer).stream()
                .map(this::toResponse)
                .toList();
    }

    public CartItemResponse addToCart(String email, CartItemRequest request) {
        Customer customer = findCustomer(email);
        ProductDTO product = productService.getProduct(request.inventoryItemId());

        if (product.price() == null) {
            throw new RuntimeException("Product price not set");
        }

        var existing = cartItemRepository.findByCustomerAndInventoryItemId(
                customer, request.inventoryItemId());

        CartItem cartItem;
        if (existing.isPresent()) {
            cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.quantity());
            cartItem.setPrice(product.price());
        } else {
            cartItem = new CartItem();
            cartItem.setCustomer(customer);
            cartItem.setInventoryItemId(request.inventoryItemId());
            cartItem.setProductName(product.name());
            cartItem.setQuantity(request.quantity());
            cartItem.setPrice(product.price());
        }

        return toResponse(cartItemRepository.save(cartItem));
    }

    public CartItemResponse updateQuantity(String email, Long cartItemId, int quantity) {
        Customer customer = findCustomer(email);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getCustomer().getId().equals(customer.getId()))
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        return toResponse(cartItemRepository.save(cartItem));
    }

    public void removeFromCart(String email, Long cartItemId) {
        Customer customer = findCustomer(email);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getCustomer().getId().equals(customer.getId()))
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItemRepository.delete(cartItem);
    }

    public void clearCart(String email) {
        Customer customer = findCustomer(email);
        cartItemRepository.deleteByCustomer(customer);
    }

    private Customer findCustomer(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    private CartItemResponse toResponse(CartItem item) {
        return new CartItemResponse(
                item.getId(),
                item.getInventoryItemId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPrice(),
                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}
