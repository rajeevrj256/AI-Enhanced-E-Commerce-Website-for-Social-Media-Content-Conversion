
# E-Commerce Solution With GenAI

Our tool extracts content (text, images, and videos) from social media posts, processes it using advanced AI algorithms, and formats it into detailed Amazon product listings. It includes features like content moderation, automatic description generation, and direct upload capabilities, simplifying the product listing process.


## Installation

Clone the project and navigate to the project directory:

```bash
git clone

```
Server
```bash
cd server
```
Add .env file
```bash 
`VITE_GOOGLE_GEMINI_AI_API_KEY`=Your gemini Api

`AWS_ACCESS_KEY_ID`=Your aws access key

`AWS_SECRET_ACCESS_KEY`=Your aws secret access key

`AWS_REGION`=Aws region

`S3_bucket`=aws S3 bucket name

`Apify_token`=Apify token

```
Run server

```bash
node index.js

```

Client

```bash
cd client
npm run dev
```

Add .env.local file

```bash
`VITE_GOOGLE_AUTH_CLIENT_ID`=Your google outh2.0 client Id from Google cloud console.

```


## Installation by Docker
```bash
git clone
docker-compose up --build
```
Access the Frontend and Backend

After running docker-compose up, your services will be available at:

Frontend: http://localhost:5173

Backend: http://localhost:5000

## AWS config

Create IAM role 

Add this policy/permission in Your role
```bash
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "DenyObjectsThatAreNotSSEKMS",
			"Effect": "Allow",
			"Action": "s3:PutObject",
			"Resource": "arn:aws:s3:::'your s3 bucket name'/*",
			"Condition": {
				"Null": {
					"s3:x-amz-server-side-encryption-aws-kms-key-id": "true"
				}
			}
		},
		{
			"Effect": "Allow",
			"Action": "transcribe:StartTranscriptionJob",
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": "transcribe:GetTranscriptionJob",
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::'your s3 bucket name'*",
			"Condition": {
				"Null": {
					"s3:x-amz-server-side-encryption-aws-kms-key-id": "true"
				}
			}
		},
		{
			"Effect": "Allow",
			"Action": [
				"rekognition:CompareFaces",
				"rekognition:DetectFaces",
				"rekognition:DetectLabels",
				"rekognition:ListCollections",
				"rekognition:ListFaces",
				"rekognition:SearchFaces",
				"rekognition:SearchFacesByImage",
				"rekognition:DetectText",
				"rekognition:GetCelebrityInfo",
				"rekognition:RecognizeCelebrities",
				"rekognition:DetectModerationLabels",
				"rekognition:GetLabelDetection",
				"rekognition:GetFaceDetection",
				"rekognition:GetContentModeration",
				"rekognition:GetPersonTracking",
				"rekognition:GetCelebrityRecognition",
				"rekognition:GetFaceSearch",
				"rekognition:GetTextDetection",
				"rekognition:GetSegmentDetection",
				"rekognition:DescribeStreamProcessor",
				"rekognition:ListStreamProcessors",
				"rekognition:DescribeProjects",
				"rekognition:DescribeProjectVersions",
				"rekognition:DetectCustomLabels",
				"rekognition:DetectProtectiveEquipment",
				"rekognition:ListTagsForResource",
				"rekognition:ListDatasetEntries",
				"rekognition:ListDatasetLabels",
				"rekognition:DescribeDataset",
				"rekognition:StartLabelDetection"
			],
			"Resource": "*"
		}
	]
}

```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_GOOGLE_GEMINI_AI_API_KEY`=Your gemini Api

`AWS_ACCESS_KEY_ID`=Your aws access key

`AWS_SECRET_ACCESS_KEY`=Your aws secret access key

`AWS_REGION`=Aws region

`S3_bucket`=aws S3 bucket name

`Apify_token`=Apify token

## Demo

https://drive.google.com/file/d/1ZBB0CGof1zhaBNQqSP1GPr8jDa8va8BQ/view?usp=sharing



