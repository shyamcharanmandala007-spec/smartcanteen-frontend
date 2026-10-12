package com.smartcanteen.controller;

import com.smartcanteen.dto.FeedbackRequest;
import com.smartcanteen.entity.Feedback;
import com.smartcanteen.entity.User;
import com.smartcanteen.service.AuthService;
import com.smartcanteen.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuthService authService;

    public FeedbackController(FeedbackService feedbackService, AuthService authService) {
        this.feedbackService = feedbackService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody FeedbackRequest request, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(feedbackService.submitFeedback(user, request));
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }
}
