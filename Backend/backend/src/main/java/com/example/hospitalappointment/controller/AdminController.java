package com.example.hospitalappointment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;

import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.service.AdminService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = adminService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/pending")
    public ResponseEntity<List<Appointment>> getPendingAppointments() {
        List<Appointment> appointments = adminService.getPendingAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/completed")
    public ResponseEntity<List<Appointment>> getCompletedAppointments() {
        List<Appointment> appointments = adminService.getCompletedAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/cancelled")
    public ResponseEntity<List<Appointment>> getCancelledAppointments() {
        List<Appointment> appointments = adminService.getCancelledAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = adminService.getAppointmentStatistics();
        return ResponseEntity.ok(stats);
    }  

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @NonNull Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
