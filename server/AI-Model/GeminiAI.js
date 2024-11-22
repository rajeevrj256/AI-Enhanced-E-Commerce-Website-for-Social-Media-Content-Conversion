import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
import { prompt } from "./prompt.js";
  
  const apiKey = process.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  
   export  const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "My user want to add their product in Ecommerce platforms like amzon myntra,flipkart etc, generate some relevant information in json formate about product ,like product title,product categories,product features,pruduct color ,product description short not more than 200 words, from this given infromation like  video reconization data like Categories :Name:Person Description,Confidence:99.89735412597656,Instances:BoundingBox:Height:0.9228578209877014, ,transciptionData like your morning's bright. Alexa, switch on the geezer. Alexa, play some romantic songs on the living room speaker and end your evenings right. Alexa, start yoga mode. Let hustle mode, fitness. Alexa, how many calories does a chocolate pastry have? Track your calories and indulge anyway. Alexa, remind me to record the reel at 11 p.m. Do it all. Do it now. Whatever you do, ask more of your Both watch extend with Alexa. and textinimage data."},
          ],
        },
        {
          role: "model",
          parts: [
            {text:`{
  "title": "Smart Fitness Watch with Alexa",
   "Brand":"Boat",
  "categories": ["Smartwatches", "Fitness Trackers", "Wearable Technology"],
  "features": [
    "Voice control with Alexa",
    "Fitness tracking (heart rate, steps, calories burned)",
    "Smart notifications",
    "Customizable watch faces and straps",
    "Long-lasting battery life",
    "Water resistance"
  ],
  "aboutThisItem": [
    "Experience the future of fitness with our cutting-edge smartwatch.",
    "Seamlessly control your day with voice commands, track your workouts, and stay connected with smart notifications.",
    "From yoga sessions to calorie tracking, this smartwatch is your ultimate fitness companion.",
    "Customize your watch face and strap to match your style.",
    "Enjoy long-lasting battery life, so you can stay connected and active all day long."
  ],
  "description":"Experience the future of fitness with our cutting-edge smartwatch. Seamlessly control your day with voice commands, track your workouts with precision, and stay connected with essential notifications. Whether you're a yoga enthusiast or a fitness fanatic, this smartwatch is your perfect workout partner.":
  "color": ["Black", "Silver", "Rose Gold"],
  "price": "$199.99"
}`},
          ],
        },
      ],
    });
    
