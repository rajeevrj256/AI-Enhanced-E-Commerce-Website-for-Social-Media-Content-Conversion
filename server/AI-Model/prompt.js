export const prompt = `
Analyze the provided video recognition data, transcription data, and image-to-text data to extract relevant product information. Use content moderation tools to ensure the extracted content complies with Amazon’s advertising policies and general content guidelines. This process ensures that no inappropriate or irrelevant content is included in the product listings.

Input: Video Recognition Data, Transcription Data, Image-to-Text Data: {input}

Output all in JSON format: Product Information should contain:
- title: A concise product title
- categories: An array of product categories
- features: An array of product features
- aboutThisItem: At least 5 bullet points that summarize the product
- description: A brief product description (no more than 200 words)
- color: An array of colors available
- price: The price of the product

For Electronic items like Smartwatches, Mobile Phones, and Televisions, include additional details like:
- form factor (e.g., size, shape, etc.)
- model name
- connectivity technology (e.g., Bluetooth, Wi-Fi, etc.)

For Cosmetic products like Lipstick or Skincare, include:
- skin tone suitability
- material type (e.g., cruelty-free, vegan, etc.)
- product benefits (e.g., moisturizing, long-lasting)
- how to use
- ingredients

If you believe the data is insufficient to generate relevant information, return the following output:
{
  "message": "Data insufficient to generate product information."
}
Ensure the JSON is structured correctly for use on an e-commerce platform like Amazon, Myntra, or Flipkart.
`;
