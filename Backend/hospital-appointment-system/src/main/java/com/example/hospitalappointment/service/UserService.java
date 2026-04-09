package com.example.hospitalappointment.service;

import com.example.hospitalappointment.dto.RegisterRequest;
import com.example.hospitalappointment.dto.UserProfileRequest;
import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.Role;
import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.repository.AppointmentRepository;
import com.example.hospitalappointment.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
        AppointmentRepository appointmentRepository,
        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (email == null) throw new UsernameNotFoundException("Email cannot be null");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .build();
    }

    @NonNull
    public User save(@NonNull User user) {
        return userRepository.save(user);
    }

    @NonNull
    public User register(@NonNull RegisterRequest request) {
        String email = request.getEmail();
        if (email != null && userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.PATIENT);
        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        if (email == null || password == null) return null;
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    @NonNull
    public Optional<User> getUserById(@NonNull Long id) {
        return userRepository.findById(id);
    }

    @NonNull
    public Optional<User> getUserByEmail(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmail(email);
    }

    @NonNull
    public User updateUserProfile(@NonNull Long userId, @NonNull UserProfileRequest request) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        u.setName(request.getName());
        u.setEmail(request.getEmail());
        u.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            u.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return userRepository.save(u);
    }

    @NonNull
    public List<Appointment> getUserAppointments(@NonNull Long userId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(userId);
        return appointments != null ? appointments : List.of();
    }

    public void deleteUser(@NonNull Long userId) {
        userRepository.deleteById(userId);
    }
}