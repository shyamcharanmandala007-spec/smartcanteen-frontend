package com.smartcanteen.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class OrderRequest {

    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    private String pickupSlot; // e.g. "ASAP (~15 min)"
    private String specialInstructions;
    private String paymentMethod; // WALLET, UPI, CARD, COUNTER

    public OrderRequest() {}

    public OrderRequest(List<OrderItemRequest> items, String pickupSlot, String specialInstructions, String paymentMethod) {
        this.items = items;
        this.pickupSlot = pickupSlot;
        this.specialInstructions = specialInstructions;
        this.paymentMethod = paymentMethod;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getPickupSlot() {
        return pickupSlot;
    }

    public void setPickupSlot(String pickupSlot) {
        this.pickupSlot = pickupSlot;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
