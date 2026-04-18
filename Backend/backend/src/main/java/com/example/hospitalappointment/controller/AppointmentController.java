package com.example.hospitalappointment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospitalappointment.dto.AppointmentRequest;
import com.example.hospitalappointment.dto.AppointmentStatusRequest;
import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.AppointmentStatus;
import com.example.hospitalappointment.service.AppointmentService;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    // ✅ BOOK
    @PostMapping("/book")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Appointment> book(@RequestBody AppointmentRequest req) {
        return ResponseEntity.ok(service.bookAppointment(req));
    }

    // ✅ MY APPOINTMENTS
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Appointment>> getMy(Authentication auth) {
        return ResponseEntity.ok(service.getAppointmentsByEmail(auth.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(service.getAllAppointments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        Optional<Appointment> appointment = service.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getAppointmentsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(service.getAppointmentsByDoctorId(doctorId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getByStatus(@PathVariable AppointmentStatus status) {
        return ResponseEntity.ok(service.getAppointmentsByStatus(status));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestBody AppointmentStatusRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<Appointment> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelAppointment(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ QUEUE POSITION
    @GetMapping("/queue/position")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getQueue(Authentication auth) {

        List<Appointment> list = service.getAppointmentsByEmail(auth.getName());

        if (list.isEmpty()) return ResponseEntity.ok(0);

        Appointment latest = list.get(list.size() - 1);

        return ResponseEntity.ok(latest.getQueueNumber());
    }

    @GetMapping("/queue/position/{patientId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getQueueForPatient(@PathVariable Long patientId) {
        List<Appointment> list = service.getAppointmentsByPatientId(patientId);

        if (list.isEmpty()) return ResponseEntity.ok(0);

        Appointment latest = list.get(list.size() - 1);

        return ResponseEntity.ok(latest.getQueueNumber());
    }
}
