package com.stockpulse.ecommerce.controller;

import com.stockpulse.ecommerce.dto.AuthResponse;
import com.stockpulse.ecommerce.dto.LoginRequest;
import com.stockpulse.ecommerce.dto.RegisterRequest;
import com.stockpulse.ecommerce.model.Customer;
import com.stockpulse.ecommerce.repository.CustomerRepository;
import com.stockpulse.ecommerce.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(CustomerRepository customerRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (customerRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already registered"));
        }

        Customer customer = new Customer(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.firstName(),
                request.lastName()
        );
        customerRepository.save(customer);

        String token = jwtUtil.generateToken(customer.getEmail());
        return ResponseEntity.ok(new AuthResponse(
                token, customer.getEmail(),
                customer.getFirstName(), customer.getLastName()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.email())
                .orElse(null);

        if (customer == null ||
                !passwordEncoder.matches(request.password(), customer.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtUtil.generateToken(customer.getEmail());
        return ResponseEntity.ok(new AuthResponse(
                token, customer.getEmail(),
                customer.getFirstName(), customer.getLastName()));
    }
}
