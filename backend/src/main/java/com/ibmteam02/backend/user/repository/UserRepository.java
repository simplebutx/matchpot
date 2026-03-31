package com.ibmteam02.backend.user.repository;


import com.ibmteam02.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //회원가입
    Boolean existsByUserName(String userName);

    //로그인
    Optional<User> findByUserName(String userName);

}
