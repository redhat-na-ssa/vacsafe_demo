package com.redhat.service;

import java.io.IOException;

import com.google.zxing.NotFoundException;
import com.google.zxing.WriterException;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.test.context.junit4.SpringRunner;

//@Ignore
@RunWith(SpringRunner.class)
@Import(TestContextConfiguration.class)
@PropertySource("classpath:application.properties")
public class QRCodeTest {


    private final static String filePath = "/tmp";
    private final static String fileName = "qrCodeTest.png";

    @Autowired
    private QRCodeService qrCodeService;

    @Test
    public void generateQRCode() throws WriterException, IOException {

        String data = "Red Hat VacSafe Test";
        String charset = "UTF-8";
        int height = 10;
        int width = 10;
        qrCodeService.createQR(data, filePath, fileName, charset, height, width);

    }

    @Test
    public void readQRCode() throws NotFoundException, IOException {

        String data = qrCodeService.readQR(filePath, fileName);
        System.out.println("readQRCode() data = :  "+data);

    }

}