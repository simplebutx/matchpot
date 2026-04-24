package com.ibmteam02.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminUserSummaryResponse {
    private String displayName;
    private String email;
    private String role;
}
