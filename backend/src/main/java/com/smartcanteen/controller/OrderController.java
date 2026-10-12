package com.smartcanteen.controller;

import com.smartcanteen.dto.OrderRequest;
import com.smartcanteen.entity.Order;
import com.smartcanteen.entity.User;
import com.smartcanteen.service.AuthService;
import com.smartcanteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(orderService.placeOrder(user, request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(orderService.getOrdersByUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}
