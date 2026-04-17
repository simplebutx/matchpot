package com.ibmteam02.backend.auth.service;

import org.springframework.stereotype.Service;

@Service
public class MailService {

    public void sendAuthCode(String email) {
        // Deployment hotfix: email verification is temporarily disabled.
    }

    public boolean verifyCode(String email, String code) {
        return true;
    }

    public void setVerifiedFlag(String email) {
        // Deployment hotfix: email verification is temporarily disabled.
    }

    public boolean isVerified(String email) {
        return true;
    }
}
