package com.example.hospitalappointment.repository;

import com.example.hospitalappointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @NonNull
    Optional<User> findByEmail(@NonNull String email);

}