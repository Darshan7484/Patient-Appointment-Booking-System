package com.example.hospitalappointment.util;

public class QueueGenerator {

    private static int number = 0;

    public static int getNextNumber() {
        number++;
        return number;
    }

}