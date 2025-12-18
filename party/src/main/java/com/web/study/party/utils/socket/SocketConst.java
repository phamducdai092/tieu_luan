package com.web.study.party.utils.socket;

public class SocketConst {
    // 1. Event Types
    public static final String EVENT_ROOM_UPDATED = "ROOM_UPDATED";

    public static final String EVENT_NEW_NOTIFICATION = "NEW_NOTIFICATION";

    // group join request
    public static final String EVENT_REQUEST_APPROVED = "REQUEST_APPROVED";
    public static final String EVENT_REQUEST_REJECTED = "REQUEST_REJECTED";

    // group member
    public static final String EVENT_MEMBER_ROLE_CHANGE = "MEMBER_ROLE_CHANGE";

    // group message
    public static final String EVENT_NEW_GROUP_MESSAGE = "NEW_GROUP_MESSAGE";

    // 2. Topic Prefixes
    public static final String PREFIX_TOPIC_ROOM = "/topic/room/";
    public static final String PREFIX_TOPIC_CHAT_ROOM = "/topic/chat/";
    public static final String PREFIX_TOPIC_USER = "/topic/user/";

}