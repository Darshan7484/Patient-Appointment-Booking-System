package com.example.hospitalappointment.controller;

import com.example.hospitalappointment.config.JwtUtil;
import com.example.hospitalappointment.dto.*;
import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.service.AuthenticationService;
import com.example.hospitalappointment.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, AuthenticationService authenticationService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.jwtUtil = jwtUtil;
    }


   @PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody @NonNull RegisterRequest request) {
    try {
        User user = userService.register(request);
        return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
    }
}


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody @NonNull LoginRequest request) {

        User user = userService.authenticate(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        // Check if email is verified
        if (!user.getEmailVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Email not verified. Please check your email for verification link.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

        return ResponseEntity.ok(new LoginResponse(token));
    }

    // ========== EMAIL VERIFICATION ENDPOINTS ==========

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody EmailVerificationRequest request) {
        boolean verified = authenticationService.verifyEmail(request.getToken());
        if (verified) {
            return ResponseEntity.ok(new MessageResponse("Email verified successfully! You can now login."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Invalid or expired verification link."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@Valid @RequestBody ForgotPasswordRequest request) {
        boolean sent = authenticationService.resendVerificationEmail(request.getEmail());
        if (sent) {
            return ResponseEntity.ok(new MessageResponse("Verification email sent successfully!"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Email not found or already verified."));
    }

    // ========== PASSWORD RESET ENDPOINTS ==========

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = authenticationService.generatePasswordResetToken(request.getEmail());
        if (token != null) {
            return ResponseEntity.ok(new MessageResponse("Password reset email sent successfully! Please check your email."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Email not found."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Passwords do not match."));
        }

        boolean reset = authenticationService.resetPassword(request.getToken(), request.getNewPassword());
        if (reset) {
            return ResponseEntity.ok(new MessageResponse("Password reset successfully! You can now login with your new password."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Invalid or expired reset link."));
    }

    public static class LoginResponse {
        private String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
