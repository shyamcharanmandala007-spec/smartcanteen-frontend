package com.smartcanteen.dto;

public class DashboardKpiResponse {

    private long pendingOrders;
    private long cookingOrders;
    private long readyOrders;
    private long completedOrders;
    private double totalRevenue;
    private long totalMenuItems;

    public DashboardKpiResponse() {}

    public DashboardKpiResponse(long pendingOrders, long cookingOrders, long readyOrders, long completedOrders, double totalRevenue, long totalMenuItems) {
        this.pendingOrders = pendingOrders;
        this.cookingOrders = cookingOrders;
        this.readyOrders = readyOrders;
        this.completedOrders = completedOrders;
        this.totalRevenue = totalRevenue;
        this.totalMenuItems = totalMenuItems;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCookingOrders() {
        return cookingOrders;
    }

    public void setCookingOrders(long cookingOrders) {
        this.cookingOrders = cookingOrders;
    }

    public long getReadyOrders() {
        return readyOrders;
    }

    public void setReadyOrders(long readyOrders) {
        this.readyOrders = readyOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalMenuItems() {
        return totalMenuItems;
    }

    public void setTotalMenuItems(long totalMenuItems) {
        this.totalMenuItems = totalMenuItems;
    }
}
