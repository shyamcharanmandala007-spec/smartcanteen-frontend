package com.smartcanteen.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class FeedbackRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Minimum rating is 1")
    @Max(value = 5, message = "Maximum rating is 5")
    private Integer rating;

    private String comment;

    public FeedbackRequest() {}

    public FeedbackRequest(Long orderId, Integer rating, String comment) {
        this.orderId = orderId;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
