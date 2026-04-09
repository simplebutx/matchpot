package com.ibmteam02.backend.global.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadImage(MultipartFile image){
        try{
            String fileName = "ibmteam02/images/" + UUID.randomUUID()+"-"+image.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getSize());
            metadata.setContentType(image.getContentType());

            amazonS3.putObject(bucket,fileName,image.getInputStream(),metadata);

            return amazonS3.getUrl(bucket, fileName).toString();

        }catch (IOException e){
            throw new RuntimeException("사진 업로드 중 에러 발생", e);
        }
    }
}
