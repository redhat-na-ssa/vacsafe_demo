package com.redhat.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;

import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component("QRCodeService")
public class QRCodeService {

    private static final Logger log = LoggerFactory.getLogger(QRCodeService.class);

    @PostConstruct
    public void init() {
        log.info("init() ");
    }

    public void createQR(String data, String filePath, String fileName, String charset, int height, int width) throws WriterException, IOException {
        BitMatrix matrix = new MultiFormatWriter().encode( 
            new String(data.getBytes(charset), charset),
            BarcodeFormat.QR_CODE, 
            width, 
            height);
        
        Path path = FileSystems.getDefault().getPath(filePath, fileName);
        
        MatrixToImageWriter.writeToPath( matrix, "png", path);
        log.info("createQR() just wrote to: "+path.toAbsolutePath().toString());
    }

    public String readQR(String filePath, String fileName ) throws IOException, NotFoundException{
        FileInputStream fiStream = null;
        String qrPayload = null;
        try{
            File fObj = new File(filePath, fileName);
            if(!fObj.exists())
              throw new RuntimeException("No file at: "+fObj.getAbsolutePath());
              
            fiStream = new FileInputStream(fObj);
            BinaryBitmap binaryBitmap = new BinaryBitmap(new HybridBinarizer( new BufferedImageLuminanceSource( ImageIO.read(fiStream))));
            Result result = new MultiFormatReader().decode(binaryBitmap);
            qrPayload = result.getText();
            return qrPayload;
        }finally {
            if(fiStream != null)
              fiStream.close();
        }
    }
    
}
