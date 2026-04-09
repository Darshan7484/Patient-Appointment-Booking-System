package com.example.hospitalappointment.service;

import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.Doctor;
import com.example.hospitalappointment.repository.AppointmentRepository;
import com.example.hospitalappointment.repository.DoctorRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SchedulerService {

    private final AppointmentRepository repo;
    private final DoctorRepository doctorRepository;
    private final EmailService emailService;

    public SchedulerService(
            AppointmentRepository repo,
            DoctorRepository doctorRepository,
            EmailService emailService
    ) {
        this.repo = repo;
        this.doctorRepository = doctorRepository;
        this.emailService = emailService;
    }

    @Scheduled(fixedRate = 60000)
    public void checkAppointments() {

        LocalDateTime now = LocalDateTime.now().plusMinutes(30);

        List<Appointment> list =
            repo.findByReminderSentFalseAndDateBefore(now);

        for (Appointment a : list) {
            String doctorName = "Unknown Doctor";
            Long doctorId = a.getDoctorId();
            if (doctorId != null) {
                Optional<Doctor> doctor = doctorRepository.findById(doctorId);
                if (doctor.isPresent()) {
                    doctorName = doctor.get().getName();
                }
            }

            emailService.sendEmail(
                    a.getPatientEmail(),
                    "Appointment Reminder",
                    "Your appointment with Dr. " + doctorName +
                    " is scheduled for " + a.getDate()
            );

            a.setReminderSent(true);

            repo.save(a);
        }
    }
}
