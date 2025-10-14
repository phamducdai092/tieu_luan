package com.web.study.party.services.mail;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.mail")
public class MailProps {
    private String from = "StudyParty <no-reply@local.test>";
    private boolean enabled = true;
}
