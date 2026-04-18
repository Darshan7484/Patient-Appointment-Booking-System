package com.example.hospitalappointment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;

import com.example.hospitalappointment.dto.DoctorRequest;
import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.Doctor;
import com.example.hospitalappointment.service.DoctorService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Doctor> addDoctor(@Valid @RequestBody @NonNull DoctorRequest doctorRequest) {
        Doctor doctor = doctorService.addDoctor(doctorRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(doctor);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAll() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable @NonNull Long id) {
        Optional<Doctor> doctor = doctorService.getDoctorById(id);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(doctor.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable @NonNull Long id,
                                              @Valid @RequestBody @NonNull DoctorRequest doctorRequest) {
        Doctor doctor = doctorService.updateDoctor(id, doctorRequest);
        return ResponseEntity.ok(doctor);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable @NonNull Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{id}/appointments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable @NonNull Long id) {
        List<Appointment> appointments = doctorService.getDoctorAppointments(id);
        return ResponseEntity.ok(appointments);
    }

}
