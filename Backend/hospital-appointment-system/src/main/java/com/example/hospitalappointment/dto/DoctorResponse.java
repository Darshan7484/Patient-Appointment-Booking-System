package com.example.hospitalappointment.dto;

public class DoctorResponse {

    private Long id;
    private String name;
    private String specialization;
    private String department;
    private String contactNumber;
    private String availableTime;

    public DoctorResponse() {
    }

    public DoctorResponse(Long id, String name, String specialization,
                         String department, String contactNumber, String availableTime) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.department = department;
        this.contactNumber = contactNumber;
        this.availableTime = availableTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }
}
