package com.web.study.party.utils.socket;

public class SocketConst {
    // 1. Event Types
    public static final String EVENT_ROOM_UPDATED = "ROOM_UPDATED";

    public static final String EVENT_NEW_NOTIFICATION = "NEW_NOTIFICATION";

    // group join request
    public static final String EVENT_JOIN_REQUEST = "JOIN_REQUEST";
    public static final String EVENT_REQUEST_APPROVED = "REQUEST_APPROVED";
    public static final String EVENT_REQUEST_REJECTED = "REQUEST_REJECTED";

    // group member
    public static final String EVENT_MEMBER_ROLE_CHANGE = "MEMBER_ROLE_CHANGE";

    // group message
    public static final String EVENT_NEW_GROUP_MESSAGE = "NEW_GROUP_MESSAGE";

    // group call
    public static final String EVENT_INCOMING_GROUP_CALL = "INCOMING_GROUP_CALL";

    //notification
    public static final String NOTIFICATION_TYPE_TASK_ASSIGNED = "TASK_ASSIGNED";
    public static final String NOTIFICATION_TYPE_TASK_RETURNED = "TASK_RETURNED";

    public static final String EVENT_INVITATION_RECEIVED = "INVITATION_RECEIVED";
    public static final String EVENT_INVITATION_ACCEPTED = "INVITATION_ACCEPTED";
    public static final String EVENT_INVITATION_DECLINED = "INVITATION_DECLINED";
    // 2. Topic Prefixes
    public static final String PREFIX_TOPIC_ROOM = "/topic/room/";
    public static final String PREFIX_TOPIC_CHAT_ROOM = "/topic/chat/";
    public static final String PREFIX_TOPIC_USER = "/topic/user/";
    public static final String TOPIC_PRESENCE_USERS = "/topic/presence/users";
    public static final String PATTERN_TOPIC_ROOM_COUNT = "/topic/room/%s/count";

}