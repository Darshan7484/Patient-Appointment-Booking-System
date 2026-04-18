package com.example.hospitalappointment.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientEmail(String email);

    long countByDoctorId(Long doctorId);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByReminderSentFalseAndDateBefore(LocalDateTime date);
    
    /**
     * Fetch upcoming appointments by status with all details(for reminders)
     */
   List<Appointment> findByDateGreaterThanEqualAndStatusNot(
        LocalDateTime date,
        AppointmentStatus status
);
}