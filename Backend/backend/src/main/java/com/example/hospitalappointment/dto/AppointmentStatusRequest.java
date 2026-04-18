package com.example.hospitalappointment.dto;

import com.example.hospitalappointment.model.AppointmentStatus;

public class AppointmentStatusRequest {
    private AppointmentStatus status;

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
}