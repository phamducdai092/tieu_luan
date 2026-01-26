package com.web.study.party.services.notification;

import com.web.study.party.dto.mapper.notification.NotificationMapper;
import com.web.study.party.dto.response.notification.NotificationResponse;
import com.web.study.party.entities.Notification;
import com.web.study.party.entities.Users;
import com.web.study.party.repositories.NotificationRepo;
import com.web.study.party.utils.socket.SocketConst;
import com.web.study.party.utils.socket.SocketNotify;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {

    private final NotificationRepo notificationRepo;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional
    @SocketNotify(
            topic = "'" + SocketConst.PREFIX_TOPIC_USER + "' + #result.recipient.id + '/notifications'",
            type = SocketConst.EVENT_NEW_NOTIFICATION
    )
    public NotificationResponse sendNotification(Users recipient, String content, String link, String type) {
        // 1. Lưu vào DB
        Notification notif = Notification.builder()
                .recipient(recipient)
                .content(content)
                .link(link)
                .type(type)
                .build();

        Notification savedNotif = notificationRepo.save(notif);
        // 2. Convert sang DTO (Để fix lỗi Hibernate Proxy)
        return notificationMapper.toResponse(savedNotif);
    }


}
