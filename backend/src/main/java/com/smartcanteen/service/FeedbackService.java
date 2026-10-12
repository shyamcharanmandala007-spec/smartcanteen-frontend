package com.smartcanteen.service;

import com.smartcanteen.dto.FeedbackRequest;
import com.smartcanteen.entity.Feedback;
import com.smartcanteen.entity.Order;
import com.smartcanteen.entity.User;
import com.smartcanteen.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final OrderService orderService;

    public FeedbackService(FeedbackRepository feedbackRepository, OrderService orderService) {
        this.feedbackRepository = feedbackRepository;
        this.orderService = orderService;
    }

    public Feedback submitFeedback(User user, FeedbackRequest request) {
        Order order = orderService.getOrderById(request.getOrderId());
        Feedback feedback = new Feedback(user, order, request.getRating(), request.getComment());
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc();
    }
}
