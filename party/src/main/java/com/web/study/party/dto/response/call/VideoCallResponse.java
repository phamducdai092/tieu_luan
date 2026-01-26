package com.web.study.party.dto.response.call;

public record VideoCallResponse(
    String token,
    String channelName, // group id
    String appId
) {}