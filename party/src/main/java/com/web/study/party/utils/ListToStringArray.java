package com.web.study.party.utils;

import java.util.List;

public class ListToStringArray {
    public static <T> String[] convert(List<T> list) {
        String[] array = new String[list.size()];
        for (int i = 0; i < list.size(); i++) {
            array[i] = list.get(i).toString();
        }
        return array;
    }
}
