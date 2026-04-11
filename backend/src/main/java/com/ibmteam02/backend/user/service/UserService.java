package com.ibmteam02.backend.user.service;

import com.ibmteam02.backend.user.dto.MyPageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    public MyPageResponse getMyPageInfo(String displayName,String username) {
        return new MyPageResponse(displayName,username);
    }
}
