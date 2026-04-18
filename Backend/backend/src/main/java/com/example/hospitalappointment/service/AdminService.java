package com.example.hospitalappointment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.AppointmentStatus;
import com.example.hospitalappointment.model.User;
import com.example.hospitalappointment.repository.AppointmentRepository;
import com.example.hospitalappointment.repository.UserRepository;

@Service
public class AdminService {

    private final AppointmentRepository appointmentRepo;
    private final UserRepository userRepo;

    public AdminService(AppointmentRepository appointmentRepo, UserRepository userRepo) {
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
    }

    // ✅ USERS
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUser(Long id) {
        if (id != null) {
            userRepo.deleteById(id);
        }
    }

    // ✅ APPOINTMENTS
    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }

    public List<Appointment> getPendingAppointments() {
        return appointmentRepo.findByStatus(AppointmentStatus.PENDING);
    }

    public List<Appointment> getCompletedAppointments() {
        return appointmentRepo.findByStatus(AppointmentStatus.COMPLETED);
    }

    public List<Appointment> getCancelledAppointments() {
        return appointmentRepo.findByStatus(AppointmentStatus.CANCELLED);
    }

    // ✅ STATISTICS
    public Map<String, Object> getAppointmentStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", appointmentRepo.count());
        stats.put("pending", appointmentRepo.findByStatus(AppointmentStatus.PENDING).size());
        stats.put("completed", appointmentRepo.findByStatus(AppointmentStatus.COMPLETED).size());
        stats.put("cancelled", appointmentRepo.findByStatus(AppointmentStatus.CANCELLED).size());

        return stats;
    }
}