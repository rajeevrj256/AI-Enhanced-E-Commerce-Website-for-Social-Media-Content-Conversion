export const prompt = `
Analyze the provided video recognition data and transcription to extract relevant product information. Use content moderation tools to ensure the extracted content complies with Amazon’s advertising policies and general content guidelines. This process ensures that no inappropriate or irrelevant content is included in the product listings.

Input: Video Recognition Data,video trnascibe data & imagetotext data: {input}

Output all in json formate: Product Information: A JSON object containing:
- title: A concise product title
- categories: An array of product categories
- features: An array of product features
-About this items:Atleast 5 points
- description: A brief product description 
-color:[Arry]
-price:
-
Ensure that the product details are categorized based on the product type, including essential information such as:
- title:
- brand:
- product categories:
- recommended use for:
- and other only in json formate,necessary details relevant to the product type, which are important for displaying on an e-commerce platform to enrich the product listing like for electronic item
it should be product top highlight like form factor model name ,connecctivinty techinlogy, like for mobile , tv ,information should be main content in data, like for 
cosmtic product like lipstick it should be contains skin tone material type free,product benefits,how to use,Ingredients in json formate.

important: if you believe that data is insufficent to generate relevenet data , you simple give one output as data in insufficent to gnerate in json formate.
`;
