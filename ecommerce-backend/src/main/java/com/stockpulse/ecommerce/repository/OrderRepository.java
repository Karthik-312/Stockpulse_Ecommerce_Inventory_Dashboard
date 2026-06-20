package com.stockpulse.ecommerce.repository;

import com.stockpulse.ecommerce.model.Customer;
import com.stockpulse.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
}
