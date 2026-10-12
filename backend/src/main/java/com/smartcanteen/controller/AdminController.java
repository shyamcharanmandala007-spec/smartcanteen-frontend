package com.smartcanteen.controller;

import com.smartcanteen.dto.DashboardKpiResponse;
import com.smartcanteen.dto.OrderStatusUpdateRequest;
import com.smartcanteen.entity.MenuItem;
import com.smartcanteen.entity.Order;
import com.smartcanteen.service.DashboardService;
import com.smartcanteen.service.MenuService;
import com.smartcanteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final MenuService menuService;

    public AdminController(DashboardService dashboardService, OrderService orderService, MenuService menuService) {
        this.dashboardService = dashboardService;
        this.orderService = orderService;
        this.menuService = menuService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardKpiResponse> getDashboardKpis() {
        return ResponseEntity.ok(dashboardService.getKpis());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }

    @PostMapping("/menu")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        return ResponseEntity.ok(menuService.createMenuItem(item));
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem item) {
        return ResponseEntity.ok(menuService.updateMenuItem(id, item));
    }

    @PatchMapping("/menu/{id}/toggle")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.toggleAvailability(id));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
    }
}
