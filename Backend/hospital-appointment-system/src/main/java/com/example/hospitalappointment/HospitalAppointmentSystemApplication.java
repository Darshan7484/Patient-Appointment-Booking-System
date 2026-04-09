package com.example.hospitalappointment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class HospitalAppointmentSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                HospitalAppointmentSystemApplication.class,
                args
        );
    }

}