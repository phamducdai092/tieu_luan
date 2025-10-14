package com.web.study.party.services.mail;

public interface MailService {
    void send(String to, String subject, String content);
    void sendOtp(String to, String purpose, String otp, int ttlSeconds);
    void sendInvitation(String to, String inviterName, String groupName, String invitationLink);
}
