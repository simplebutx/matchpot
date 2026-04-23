package com.ibmteam02.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageResponse {
    private Long id;
    private String displayName;
    private String username;
    private String role;
}
