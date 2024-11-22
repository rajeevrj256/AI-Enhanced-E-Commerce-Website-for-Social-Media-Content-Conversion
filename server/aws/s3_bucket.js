import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from './aws_config.js';  
import dotenv from 'dotenv';
dotenv.config();

export const uploadFileToS3 = async (fileBuffer, fileName, mimeType, bucketName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,  
      Body: fileBuffer,
      ContentType: mimeType, 
    };

    const uploadResult = await s3.send(new PutObjectCommand(params));
    return { success: true, message: 'File uploaded successfully', uploadResult };
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return { success: false, message: 'Failed to upload file to S3', error };
  }
};

