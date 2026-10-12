package com.smartcanteen.service;

import com.smartcanteen.dto.OrderItemRequest;
import com.smartcanteen.dto.OrderRequest;
import com.smartcanteen.entity.*;
import com.smartcanteen.repository.MenuItemRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order placeOrder(User user, OrderRequest request) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("ORD-" + (1000 + new Random().nextInt(9000)));
        order.setPickupToken("#T-" + (100 + new Random().nextInt(900)));
        order.setStatus(OrderStatus.PENDING);
        order.setPickupSlot(request.getPickupSlot() != null ? request.getPickupSlot() : "ASAP (~15 min)");
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "WALLET");

        double total = 0.0;
        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemReq.getMenuItemId()));

            double itemTotal = menuItem.getPrice() * itemReq.getQuantity();
            total += itemTotal;

            OrderItem orderItem = new OrderItem(order, menuItem, itemReq.getQuantity(), menuItem.getPrice());
            order.addItem(orderItem);
        }

        order.setTotalAmount(total);

        // Deduct from wallet if wallet payment
        if ("WALLET".equalsIgnoreCase(order.getPaymentMethod())) {
            if (user.getWalletBalance() < total) {
                throw new RuntimeException("Insufficient wallet balance! Current balance: ₹" + user.getWalletBalance());
            }
            user.setWalletBalance(user.getWalletBalance() - total);
            userRepository.save(user);
            order.setPaymentStatus("PAID");
        } else {
            order.setPaymentStatus("PAID");
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtAsc(status);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
