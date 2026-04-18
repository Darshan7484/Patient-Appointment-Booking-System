package com.example.hospitalappointment.repository;

import com.example.hospitalappointment.model.Doctor;
import com.example.hospitalappointment.model.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    /**
     * Get all availability slots for a specific doctor on a specific date
     */
    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.date = :date ORDER BY da.startTime ASC")
    List<DoctorAvailability> findByDoctorAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    /**
     * Get all availability slots for a doctor
     */
    List<DoctorAvailability> findByDoctorIdOrderByDateAscStartTimeAsc(Long doctorId);

    /**
     * Get all available slots (not booked) for a doctor on a date
     */
    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.date = :date AND da.isAvailable = true ORDER BY da.startTime ASC")
    List<DoctorAvailability> findAvailableSlots(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    /**
     * Get all availability slots for a doctor after a certain date
     */
    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.date >= :startDate ORDER BY da.date ASC, da.startTime ASC")
    List<DoctorAvailability> findFutureAvailability(@Param("doctorId") Long doctorId, @Param("startDate") LocalDate startDate);

    /**
     * Check if doctor has any availability on a specific date
     */
    @Query("SELECT CASE WHEN COUNT(da) > 0 THEN true ELSE false END FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.date = :date")
    boolean hasAvailabilityOnDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
}
