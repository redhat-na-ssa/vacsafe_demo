package com.redhat.vax.model;

import java.util.regex.Pattern;

public class Utils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^(.+)@(.+)$");

    public static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    public static boolean isEmailValid(String s) {
        return EMAIL_PATTERN.matcher(s).matches();
    }

    public static boolean isEmailBlankOrValid(String s) {
        return isBlank(s) || isEmailValid(s);
    }

}
