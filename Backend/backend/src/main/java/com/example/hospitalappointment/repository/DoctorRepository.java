package com.example.hospitalappointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hospitalappointment.model.Doctor;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

}