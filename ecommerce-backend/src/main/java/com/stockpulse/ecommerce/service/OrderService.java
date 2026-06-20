package com.stockpulse.ecommerce.service;

import com.stockpulse.ecommerce.dto.CartItemResponse;
import com.stockpulse.ecommerce.dto.OrderItemResponse;
import com.stockpulse.ecommerce.dto.OrderResponse;
import com.stockpulse.ecommerce.model.*;
import com.stockpulse.ecommerce.repository.CustomerRepository;
import com.stockpulse.ecommerce.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final CartService cartService;
    private final StockPulseClient stockPulseClient;

    public OrderService(OrderRepository orderRepository,
                        CustomerRepository customerRepository,
                        CartService cartService,
                        StockPulseClient stockPulseClient) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.cartService = cartService;
        this.stockPulseClient = stockPulseClient;
    }

    public OrderResponse checkout(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<CartItemResponse> cartItems = cartService.getCart(email);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.CONFIRMED);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItemResponse cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setInventoryItemId(cartItem.inventoryItemId());
            orderItem.setProductName(cartItem.productName());
            orderItem.setQuantity(cartItem.quantity());
            orderItem.setPrice(cartItem.price());
            order.addItem(orderItem);
            total = total.add(cartItem.subtotal());

            try {
                stockPulseClient.adjustStock(cartItem.inventoryItemId(), -cartItem.quantity());
            } catch (Exception e) {
                log.error("Failed to adjust stock for item {}: {}",
                        cartItem.inventoryItemId(), e.getMessage());
            }
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        cartService.clearCart(email);
        log.info("Order #{} placed for customer {}", saved.getId(), email);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return orderRepository.findByCustomerOrderByOrderDateDesc(customer).stream()
                .map(this::toResponse)
                .toList();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getInventoryItemId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                )).toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getStatus().name(),
                order.getTotalAmount(),
                items
        );
    }
}
