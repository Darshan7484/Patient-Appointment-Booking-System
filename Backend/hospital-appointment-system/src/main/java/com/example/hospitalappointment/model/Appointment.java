package com.example.hospitalappointment.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private String patientEmail;

    @Column(nullable = false)
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(nullable = false)
    private boolean reminderSent;

    @Column(nullable = false)
    private int queueNumber;

    // GETTERS
    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public Long getDoctorId() { return doctorId; }
    public String getPatientEmail() { return patientEmail; }
    public LocalDateTime getDate() { return date; }
    public AppointmentStatus getStatus() { return status; }
    public boolean isReminderSent() { return reminderSent; }
    public int getQueueNumber() { return queueNumber; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    public void setReminderSent(boolean reminderSent) { this.reminderSent = reminderSent; }
    public void setQueueNumber(int queueNumber) { this.queueNumber = queueNumber; }
}