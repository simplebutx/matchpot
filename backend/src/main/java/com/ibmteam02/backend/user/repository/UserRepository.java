package com.ibmteam02.backend.user.repository;


import com.ibmteam02.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
