package com.example.hospitalappointment.service;

import com.example.hospitalappointment.dto.AvailabilitySlotDTO;
import com.example.hospitalappointment.model.Doctor;
import com.example.hospitalappointment.model.DoctorAvailability;
import com.example.hospitalappointment.repository.DoctorAvailabilityRepository;
import com.example.hospitalappointment.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    public DoctorAvailabilityService(DoctorAvailabilityRepository availabilityRepository,
                                    DoctorRepository doctorRepository) {
        this.availabilityRepository = availabilityRepository;
        this.doctorRepository = doctorRepository;
    }

    /**
     * Add availability slots for a doctor
     */
    @Transactional
    public DoctorAvailability addAvailabilitySlot(Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        // Validate doctor exists
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        // Validate times
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new RuntimeException("Start time must be before end time");
        }

        if (date.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot add availability for past dates");
        }

        // Check for overlapping slots
        List<DoctorAvailability> existingSlots = availabilityRepository.findByDoctorAndDate(doctorId, date);
        for (DoctorAvailability slot : existingSlots) {
            if (isTimeOverlapping(slot.getStartTime(), slot.getEndTime(), startTime, endTime)) {
                throw new RuntimeException("Overlapping availability slot already exists");
            }
        }

        DoctorAvailability availability = new DoctorAvailability(doctor, date, startTime, endTime);
        return availabilityRepository.save(availability);
    }

    /**
     * Get all available slots for a doctor on a specific date
     */
    public List<AvailabilitySlotDTO> getAvailableSlots(Long doctorId, LocalDate date) {
        return availabilityRepository.findAvailableSlots(doctorId, date)
                .stream()
                .filter(DoctorAvailability::isSlotAvailable)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all availability for a specific doctor
     */
    public List<AvailabilitySlotDTO> getDoctorAvailability(Long doctorId) {
        return availabilityRepository.findByDoctorIdOrderByDateAscStartTimeAsc(doctorId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get future availability slots for a doctor
     */
    public List<AvailabilitySlotDTO> getFutureAvailability(Long doctorId) {
        return availabilityRepository.findFutureAvailability(doctorId, LocalDate.now())
                .stream()
                .filter(DoctorAvailability::isSlotAvailable)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Mark a slot as unavailable (when appointment is booked)
     */
    @Transactional
    public void markSlotAsUnavailable(Long availabilityId) {
        DoctorAvailability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Availability slot not found"));
        
        availability.setIsAvailable(false);
        availabilityRepository.save(availability);
    }

    /**
     * Check if a doctor is available at a specific date and time
     */
    public boolean isDoctorAvailable(Long doctorId, LocalDate date, LocalTime time) {
        List<DoctorAvailability> slots = availabilityRepository.findAvailableSlots(doctorId, date);
        return slots.stream().anyMatch(slot -> 
            slot.isSlotAvailable() && 
            slot.containsTime(time)
        );
    }

    /**
     * Get available slot for a specific doctor, date and time
     */
    public Optional<DoctorAvailability> getAvailableSlot(Long doctorId, LocalDate date, LocalTime time) {
        return availabilityRepository.findAvailableSlots(doctorId, date)
                .stream()
                .filter(slot -> slot.isSlotAvailable() && slot.containsTime(time))
                .findFirst();
    }

    /**
     * Delete availability slot
     */
    @Transactional
    public void deleteAvailabilitySlot(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }

    /**
     * Check if two time ranges overlap
     */
    private boolean isTimeOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return !end1.isBefore(start2) && !end2.isBefore(start1);
    }

    /**
     * Convert DoctorAvailability entity to DTO
     */
    private AvailabilitySlotDTO convertToDTO(DoctorAvailability availability) {
        return new AvailabilitySlotDTO(
            availability.getId(),
            availability.getDoctor().getId(),
            availability.getDoctor().getName(),
            availability.getDate(),
            availability.getStartTime(),
            availability.getEndTime(),
            availability.getIsAvailable()
        );
    }
}
