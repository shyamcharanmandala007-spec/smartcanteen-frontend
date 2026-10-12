package com.smartcanteen.service;

import com.smartcanteen.dto.AuthRequest;
import com.smartcanteen.dto.AuthResponse;
import com.smartcanteen.dto.RegisterRequest;
import com.smartcanteen.entity.Role;
import com.smartcanteen.entity.User;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getWalletBalance());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        Role role = Role.ROLE_STUDENT;
        if ("ROLE_ADMIN".equalsIgnoreCase(request.getRole()) || "ADMIN".equalsIgnoreCase(request.getRole())) {
            role = Role.ROLE_ADMIN;
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                300.0 // Welcome bonus wallet balance for students
        );

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getWalletBalance());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
