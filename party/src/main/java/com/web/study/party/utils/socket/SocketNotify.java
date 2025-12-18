package com.web.study.party.utils.socket;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface SocketNotify {
    // SpEL expression để tạo topic động
    // Ví dụ: "'/topic/room/' + #result.slug"
    String topic(); 
    
    // Loại sự kiện (SocketConst.EVENT_...)
    String type();
}