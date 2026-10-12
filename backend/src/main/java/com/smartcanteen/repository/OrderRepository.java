package com.smartcanteen.repository;

import com.smartcanteen.entity.Order;
import com.smartcanteen.entity.OrderStatus;
import com.smartcanteen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByPickupToken(String pickupToken);

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status = com.smartcanteen.entity.OrderStatus.COMPLETED")
    Double sumCompletedTotalRevenue();
}
