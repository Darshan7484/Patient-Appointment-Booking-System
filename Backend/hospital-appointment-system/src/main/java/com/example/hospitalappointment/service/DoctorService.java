package com.example.hospitalappointment.service;

import com.example.hospitalappointment.dto.DoctorRequest;
import com.example.hospitalappointment.model.Appointment;
import com.example.hospitalappointment.model.Doctor;
import com.example.hospitalappointment.repository.AppointmentRepository;
import com.example.hospitalappointment.repository.DoctorRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @NonNull
    public Doctor addDoctor(@NonNull DoctorRequest request) {
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setDepartment(request.getDepartment());
        doctor.setContactNumber(request.getContactNumber());
        doctor.setAvailableTime(request.getAvailableTime());
        return doctorRepository.save(doctor);
    }

    @NonNull
    public Doctor addDoctorEntity(@NonNull Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @NonNull
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @NonNull
    public Optional<Doctor> getDoctorById(@NonNull Long id) {
        return doctorRepository.findById(id);
    }

    @NonNull
    public Doctor updateDoctor(@NonNull Long id, @NonNull DoctorRequest request) {
        Optional<Doctor> doctor = doctorRepository.findById(id);

        if (doctor.isPresent()) {
            Doctor doc = doctor.get();
            doc.setName(request.getName());
            doc.setSpecialization(request.getSpecialization());
            doc.setDepartment(request.getDepartment());
            doc.setContactNumber(request.getContactNumber());
            doc.setAvailableTime(request.getAvailableTime());
            return doctorRepository.save(doc);
        }

        throw new RuntimeException("Doctor not found with id: " + id);
    }

    public void deleteDoctor(@NonNull Long id) {
        doctorRepository.deleteById(id);
    }

    public boolean checkAvailability(@NonNull Long doctorId, @NonNull LocalDateTime dateTime) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);

        for (Appointment app : appointments) {
            if (app.getDate().equals(dateTime)) {
                return false;
            }
        }

        return true;
    }

    @NonNull
    public List<Appointment> getDoctorAppointments(@NonNull Long doctorId) {
        if (doctorId == null) return List.of();
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments != null ? appointments : List.of();
    }
}
