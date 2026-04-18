package com.example.hospitalappointment.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.hospitalappointment.dto.AppointmentRequest;
import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.AppointmentStatus;
import com.example.hospitalappointment.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    // ✅ BOOK APPOINTMENT
    public Appointment bookAppointment(AppointmentRequest req) {

        Appointment a = new Appointment();

        a.setPatientId(req.getPatientId());
        a.setDoctorId(req.getDoctorId());
        a.setPatientEmail(req.getPatientEmail());
        a.setDate(LocalDateTime.now());
        a.setStatus(AppointmentStatus.PENDING);

        // ✅ QUEUE LOGIC
        long count = repo.countByDoctorId(req.getDoctorId());
        a.setQueueNumber((int) count + 1);

        return repo.save(a);
    }

    // ✅ GET BY EMAIL
    public List<Appointment> getAppointmentsByEmail(String email) {
        return repo.findByPatientEmail(email);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        if (id == null) return Optional.empty();
        return repo.findById(id);
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        if (patientId == null) return List.of();
        List<Appointment> appointments = repo.findByPatientId(patientId);
        return appointments != null ? appointments : List.of();
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        if (doctorId == null) return List.of();
        List<Appointment> appointments = repo.findByDoctorId(doctorId);
        return appointments != null ? appointments : List.of();
    }

    public List<Appointment> getAllAppointments() {
        return repo.findAll();
    }

    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return repo.findByStatus(status);
    }

    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        appointment.setStatus(status);
        return repo.save(appointment);
    }

    public Appointment cancelAppointment(Long id) {
        return updateStatus(id, AppointmentStatus.CANCELLED);
    }

    public void deleteAppointment(Long id) {
        if (id != null) {
            repo.deleteById(id);
        }
    }
}
