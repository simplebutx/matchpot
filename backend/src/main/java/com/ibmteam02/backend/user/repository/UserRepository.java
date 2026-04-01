package com.ibmteam02.backend.user.repository;


import com.ibmteam02.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //회원가입
    Boolean existsByEmail(String email);

    //로그인
    Optional<User> findByEmail(String email);

}
