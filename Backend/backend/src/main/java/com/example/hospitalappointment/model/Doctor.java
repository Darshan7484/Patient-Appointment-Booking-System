package com.example.hospitalappointment.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String specialization;

    private String department;

    private String contactNumber;

    private String availableTime;

    public Doctor() {
    }

    public Doctor(String name, String specialization, String availableTime) {
        this.name = name;
        this.specialization = specialization;
        this.availableTime = availableTime;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getDepartment() {
        return department;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }
}
