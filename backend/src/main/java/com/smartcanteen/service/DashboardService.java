package com.smartcanteen.service;

import com.smartcanteen.dto.DashboardKpiResponse;
import com.smartcanteen.entity.OrderStatus;
import com.smartcanteen.repository.MenuItemRepository;
import com.smartcanteen.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    public DashboardService(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public DashboardKpiResponse getKpis() {
        long pending = orderRepository.countByStatus(OrderStatus.PENDING);
        long cooking = orderRepository.countByStatus(OrderStatus.PREPARING) + orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long ready = orderRepository.countByStatus(OrderStatus.READY);
        long completed = orderRepository.countByStatus(OrderStatus.COMPLETED);
        Double totalRevenue = orderRepository.sumCompletedTotalRevenue();
        long totalMenuItems = menuItemRepository.count();

        return new DashboardKpiResponse(
                pending,
                cooking,
                ready,
                completed,
                totalRevenue != null ? totalRevenue : 0.0,
                totalMenuItems
        );
    }
}
