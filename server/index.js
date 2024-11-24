import express from 'express';
import multer from 'multer';
import { uploadFileToS3 } from './aws/s3_bucket.js'; // Import your S3 upload function
import cors from 'cors';
import { analyzeMediaWithRekognition } from './aws/aws_rekognition.js'; // Rekognition for images/videos
import { transcribeMediaWithAmazonTranscribe } from './aws/aws_transcribe.js';
import * as dotenv from 'dotenv';
import { chatSession } from './AI-Model/GeminiAI.js'; // Import your AI model function
import { prompt } from './AI-Model/prompt.js';
import axios from 'axios';
import { instaFetch } from './social-media-content/instagram.js';
dotenv.config();

const app = express();
const upload = multer(); // Using memory storage for the file

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
// const fetchInstagramMedia = async (url) => {
//   try {
//     // Launch Puppeteer browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle0' });

//     const mediaUrl = await page.evaluate(() => {
//       // Extract the embedded media URL
//       const scriptTag = document.querySelector('script[type="text/javascript"]');
//       if (scriptTag) {
//         const jsonData = scriptTag.textContent;
//         const jsonMatch = jsonData.match(/window\._sharedData = ({.*?});/);
//         if (jsonMatch && jsonMatch[1]) {
//           const mediaData = JSON.parse(jsonMatch[1]);
//           return mediaData.entry_data.PostPage[0].graphql.shortcode_media.video_url || mediaData.entry_data.PostPage[0].graphql.shortcode_media.display_url;
//         }
//       }
//       return null;
//     });

//     await browser.close();

//     if (!mediaUrl) {
//       throw new Error('Failed to extract media URL');
//     }
//     return mediaUrl;
//   } catch (error) {
//     console.error('Error fetching Instagram media:', error);
//     throw error;
//   }
// };
// POST route to handle file upload and processing
app.post('/upload/aws_operations', upload.single('file'), async (req, res) => {
  const { fileSource, url } = req.body;
  let fileBuffer, originalname, mimetype,mediaUrl;
  const bucketName = process.env.S3_bucket;

  try {
    if (fileSource === 'file') {
      // Handle file upload
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      fileBuffer = req.file.buffer;
      originalname = req.file.originalname;
      mimetype = req.file.mimetype;

    } else if (fileSource === 'url') {
      // Handle URL upload
      if (!url) {
        return res.status(400).json({ message: "No URL provided" });
      }
      console.log(url);
      mediaUrl=await instaFetch(url);
      const finalUrl = mediaUrl?.videoUrl || mediaUrl?.images?.[0];

      if (!finalUrl) {
        throw new Error("Media URL not found");
    }

      
      const response = await axios.get(finalUrl, { responseType: 'arraybuffer' });

       if (!response.data) {
      return res.status(400).json({ message: "Failed to fetch media from the provided URL" });
    }

      
      fileBuffer = Buffer.from(response.data);
      originalname = url.split('/').pop(); 
      mimetype = response.headers['content-type'];

    } else {
      return res.status(400).json({ message: "Invalid fileSource value" });
    }

    const timestamp = Date.now();
    const objectKey = `${timestamp}_${originalname}`;

    // Upload the file to S3
    const uploadResult = await uploadFileToS3(fileBuffer, objectKey, mimetype, bucketName);

    if (uploadResult.success) {
      console.log("File uploaded successfully:", objectKey);

      const processedData = {
        imageToTextData: null,
        videoRecognition: null,
        videoToTextTranscribe: null,
        socialmediaCaption:null,
        socialmediaHastags:null,
      };

      // Call Amazon Transcribe if the file is audio/video
      let transcriptionText = '';
      if (mimetype.startsWith('audio/') || mimetype.startsWith('video/')) {
        const transcribeResult = await transcribeMediaWithAmazonTranscribe(bucketName, objectKey, mimetype);
        
        if (transcribeResult.success) {
          const jsonResponse = await axios.get(transcribeResult.transcriptionText);
          transcriptionText = jsonResponse.data;
          processedData.videoToTextTranscribe = JSON.stringify(transcriptionText) || "null";
        } else {
          return res.status(500).json({ message: transcribeResult.message });
        }
      }

      // Analyze the uploaded file with Rekognition if it's an image or video
      let rekognitionLabels = [];
      let detectedText = null;

      if (mimetype.startsWith('image/') || mimetype.startsWith('video/')) {
        const rekognitionResult = await analyzeMediaWithRekognition(bucketName, objectKey, mimetype);
        
        if (rekognitionResult.success) {
          processedData.videoRecognition = JSON.stringify(rekognitionResult.labels) || "null"; // Video recognition labels
          processedData.imageToTextData = JSON.stringify(rekognitionResult.detectedText) || "null"; // Image text data
          detectedText = rekognitionResult.detectedText || null;
        } else {
          return res.status(500).json({ message: rekognitionResult.message });
        }
      }
      if(mediaUrl){
        processedData.socialmediaCaption=JSON.stringify(mediaUrl.caption) || "null";
        processedData.socialmediaHastags=JSON.stringify(mediaUrl.hashtags) || "null";
      }
      console.log(processedData);

      // Construct the prompt for the AI model
      const filterdata = `"videoRecognition data " + ${processedData.videoRecognition} + " imageToTextData " + ${processedData.imageToTextData} + " videoToTextTranscribe data " + ${processedData.videoToTextTranscribe} +"if social-median then captions data"+${processedData.socialmediaCaption} + "and hashtags"+${processedData.socialmediaHastags}`;
      const finalprompt = prompt.replace('{input}', filterdata);

      // Generate product information using AI
      const geminiResponse = await chatSession.sendMessage(finalprompt);

      console.log("Generated Product Info:", geminiResponse?.response.text());

      return res.status(200).json({
        message: 'File uploaded and processed successfully',
        generatedProductInfo: geminiResponse.response.text() || null,
      });
    } else {
      return res.status(500).json({ message: 'Failed to upload file to S3' });
    }
  } catch (error) {
    console.error("Error uploading or processing file:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
