package com.stockpulse.ecommerce.repository;

import com.stockpulse.ecommerce.model.CartItem;
import com.stockpulse.ecommerce.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomer(Customer customer);
    Optional<CartItem> findByCustomerAndInventoryItemId(Customer customer, Long inventoryItemId);
    void deleteByCustomer(Customer customer);
}
