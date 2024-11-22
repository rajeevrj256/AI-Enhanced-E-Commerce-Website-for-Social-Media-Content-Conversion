import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';

const transcribeClient = new TranscribeClient({ region: 'ap-south-1' });

export const transcribeMediaWithAmazonTranscribe = async (bucketName, objectKey, mimetype) => {
  try {
    if (!mimetype.startsWith('audio/') && !mimetype.startsWith('video/')) {
      return { success: false, message: 'File must be an audio or video format' };
    }

    const transcriptionJobName = `TranscriptionJob-${Date.now()}`; 

    // Start the transcription job
    const startTranscriptionParams = {
      TranscriptionJobName: transcriptionJobName,
      LanguageCode: 'en-US', // You can change the language if needed
      Media: {
        MediaFileUri: `s3://${bucketName}/${objectKey}`, 
      },
      MediaFormat: mimetype.includes('mp4') ? 'mp4' : mimetype.split('/')[1], 
    };

    const startTranscriptionCommand = new StartTranscriptionJobCommand(startTranscriptionParams);
    const result = await transcribeClient.send(startTranscriptionCommand);

    const jobId = result.TranscriptionJob.TranscriptionJobName;

    // Wait for the transcription job to complete (this can be optimized in production)
    const getTranscriptionParams = { TranscriptionJobName: jobId };
    const getTranscriptionCommand = new GetTranscriptionJobCommand(getTranscriptionParams);

    // Polling for job completion (in a real-world scenario, this would be asynchronous with better handling)
    let jobStatus = 'IN_PROGRESS';
    let transcriptionText = '';

    while (jobStatus === 'IN_PROGRESS') {
      const statusResult = await transcribeClient.send(getTranscriptionCommand);
      jobStatus = statusResult.TranscriptionJob.TranscriptionJobStatus;
      
      if (jobStatus === 'COMPLETED') {
        transcriptionText = statusResult.TranscriptionJob.Transcript.TranscriptFileUri;
      }

      // Sleep for a while before checking again (e.g., 5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (jobStatus === 'COMPLETED') {
      return {
        success: true,
        transcriptionText: transcriptionText, // URL to the transcribed text file
      };
    } else {
      return {
        success: false,
        message: 'Transcription job failed or was not completed in time.',
      };
    }
  } catch (error) {
    console.error("Error transcribing media with Amazon Transcribe:", error);
    return { success: false, message: error.message };
  }
};
