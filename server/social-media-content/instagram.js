import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
dotenv.config();
// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.Apify_token, 
});

// Function to fetch Instagram media using Apify
export const instaFetch = async (url) => {
    const input = {
        "directUrls": [url],
        "resultsType": "posts", // Fetching post data
        "resultsLimit": 100,     // Fetch only the first result for simplicity
    };

    try {
        // Run the actor
        const run = await client.actor('shu8hvrXbJbY3Eb9W').call(input);

        // Fetch results from the actor's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (items.length > 0) {
            // Return the first item's media URL
            return items[0] || null;
        } else {
            throw new Error('No media found for the provided URL.');
        }
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        throw error; // Rethrow error for further handling
    }
};

