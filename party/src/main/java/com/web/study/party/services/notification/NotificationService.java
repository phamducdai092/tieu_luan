package com.web.study.party.services.notification;

import com.web.study.party.dto.response.notification.NotificationResponse;
import com.web.study.party.entities.Users;

public interface NotificationService {

    NotificationResponse sendNotification(Users recipient, String content, String link, String type);

}
