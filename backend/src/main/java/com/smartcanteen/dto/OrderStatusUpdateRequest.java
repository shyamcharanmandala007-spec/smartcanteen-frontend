package com.smartcanteen.dto;

import com.smartcanteen.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    private OrderStatus status;

    public OrderStatusUpdateRequest() {}

    public OrderStatusUpdateRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
