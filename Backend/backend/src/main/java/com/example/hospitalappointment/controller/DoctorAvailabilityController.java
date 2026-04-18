package com.example.hospitalappointment.controller;

import com.example.hospitalappointment.dto.AddAvailabilityRequest;
import com.example.hospitalappointment.dto.AvailabilitySlotDTO;
import com.example.hospitalappointment.dto.MessageResponse;
import com.example.hospitalappointment.model.DoctorAvailability;
import com.example.hospitalappointment.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    public DoctorAvailabilityController(DoctorAvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    /**
     * Add availability slot for a doctor
     * Only doctors can add their own availability
     */
    @PostMapping("/add")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addAvailability(@Valid @RequestBody AddAvailabilityRequest request) {
        try {
            DoctorAvailability availability = availabilityService.addAvailabilitySlot(
                request.getDoctorId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
            );
            return ResponseEntity.ok(new MessageResponse("Availability slot added successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Get available slots for a doctor on a specific date
     * Available for all users
     */
    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AvailabilitySlotDTO> slots = availabilityService.getAvailableSlots(doctorId, date);
            return ResponseEntity.ok(slots);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Get all availability for a doctor
     * Available for all users
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long doctorId) {
        try {
            List<AvailabilitySlotDTO> availability = availabilityService.getDoctorAvailability(doctorId);
            return ResponseEntity.ok(availability);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Get future availability for a doctor (next 30 days)
     * Available for all users
     */
    @GetMapping("/doctor/{doctorId}/future")
    public ResponseEntity<?> getFutureAvailability(@PathVariable Long doctorId) {
        try {
            List<AvailabilitySlotDTO> availability = availabilityService.getFutureAvailability(doctorId);
            return ResponseEntity.ok(availability);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Delete availability slot
     * Only doctors can delete their own availability
     */
    @DeleteMapping("/{availabilityId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long availabilityId) {
        try {
            availabilityService.deleteAvailabilitySlot(availabilityId);
            return ResponseEntity.ok(new MessageResponse("Availability slot deleted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Check if doctor is available at a specific date and time
     * Available for all users (used for appointment booking)
     */
    @GetMapping("/doctor/{doctorId}/check")
    public ResponseEntity<?> checkAvailability(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String time) {
        try {
            java.time.LocalTime localTime = java.time.LocalTime.parse(time);
            boolean available = availabilityService.isDoctorAvailable(doctorId, date, localTime);
            return ResponseEntity.ok(new AvailabilityCheckResponse(available));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Invalid time format. Use HH:mm"));
        }
    }

    /**
     * Response class for availability check
     */
    public static class AvailabilityCheckResponse {
        private Boolean available;

        public AvailabilityCheckResponse(Boolean available) {
            this.available = available;
        }

        public Boolean getAvailable() {
            return available;
        }

        public void setAvailable(Boolean available) {
            this.available = available;
        }
    }
}
