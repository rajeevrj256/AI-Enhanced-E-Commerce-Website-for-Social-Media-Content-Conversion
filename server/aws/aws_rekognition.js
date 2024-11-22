import { RekognitionClient, DetectLabelsCommand, DetectTextCommand, StartLabelDetectionCommand, GetLabelDetectionCommand } from '@aws-sdk/client-rekognition';

// Initialize AWS Rekognition client
const rekognitionClient = new RekognitionClient({
  region: 'ap-south-1', 
});

// Helper function to check if a file is an image or a video based on the MIME type or extension
const isImage = (mimeType) => {
  return mimeType.startsWith('image/');
};

const isVideo = (mimeType) => {
  return mimeType.startsWith('video/');
};

// Function to analyze image labels, extract text, or analyze video
export const analyzeMediaWithRekognition = async (s3BucketName, s3ObjectKey, mimeType) => {
  try {
    console.log("Starting analyzeMediaWithRekognition");

    if (isImage(mimeType)) {
      // Step 1: Detect labels for image
      const labelParams = {
        Image: {
          S3Object: {
            Bucket: s3BucketName,
            Name: s3ObjectKey,
          },
        },
        MaxLabels: 5,
        MinConfidence: 75, // Minimum confidence level for labels
      };

      const labelCommand = new DetectLabelsCommand(labelParams);
      const labelData = await rekognitionClient.send(labelCommand);
      console.log("Labels detected:", labelData.Labels);

      // Step 2: Detect text in the image
      const textParams = {
        Image: {
          S3Object: {
            Bucket: s3BucketName,
            Name: s3ObjectKey,
          },
        },
      };

      const textCommand = new DetectTextCommand(textParams);
      const textData = await rekognitionClient.send(textCommand);
      console.log("Text detected:", textData.TextDetections);

      // Return both labels and text for images
      return { success: true, labels: labelData.Labels, detectedText: textData.TextDetections };

    } else if (isVideo(mimeType)) {
      // Step 1: Detect labels for video
      const videoParams = {
        Video: {
          S3Object: {
            Bucket: s3BucketName,
            Name: s3ObjectKey,
          },
        },
        MaxLabels: 5,
        MinConfidence: 75, // Minimum confidence level for labels
      };

      const videoCommand = new StartLabelDetectionCommand(videoParams);
      const videoData = await rekognitionClient.send(videoCommand);
      console.log("Video label detection started:", videoData);

      // Wait for the video label detection to complete, check status, and get results
      let jobStatus = 'IN_PROGRESS';
      let videoResult = null;

      // Poll the job status
      while (jobStatus === 'IN_PROGRESS') {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking status
        const resultCommand = new GetLabelDetectionCommand({ JobId: videoData.JobId });
        const resultData = await rekognitionClient.send(resultCommand);
        jobStatus = resultData.JobStatus;

        if (jobStatus === 'SUCCEEDED') {
          videoResult = resultData.Labels;
          console.log("Video labels detected:", videoResult);
        } else if (jobStatus === 'FAILED') {
          return { success: false, message: 'Video label detection failed' };
        }
      }

      // Return video labels if detected successfully
      return { success: true, labels: videoResult };
    } else {
      return { success: false, message: 'Unsupported media type' };
    }

  } catch (error) {
    console.error('Error analyzing media with Rekognition:', error);
    return { success: false, message: 'Failed to analyze media with Rekognition', error };
  }
};

// Example usage:
// const s3BucketName = "rjbucket256";
// const s3ObjectKey = "1732038846788_1732031849144_BMW-M8-46-Copy-1020x680.jpg";
// const mimeType = "image/jpeg"; // or "video/mp4"

// analyzeMediaWithRekognition(s3BucketName, s3ObjectKey, mimeType)
//   .then(result => {
//     if (result.success) {
//       console.log("Labels and Text detected:", result);
//     } else {
//       console.error("Error:", result.message);
//     }
//   })
