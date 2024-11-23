import { ApifyClient } from 'apify-client';

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_blGafbMdKkyaiScVn52ThBFNhavdc10HbqUl', // Ensure your token is set in the environment
});

// Function to fetch Instagram media using Apify
export const instaFetch = async (url) => {
    const input = {
        "directUrls": [url],
        "resultsType": "posts", 
        "resultsLimit": 100,     
    };

    try {
        // Run the actor
        const run = await client.actor('KoJrdxJCTtpon81KY').call(input);

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

(async () => {
    // Define a sample Instagram URL for testing
    const testUrl = 'https://www.facebook.com/commerce/listing/3908784322690907/?media_id=0&ref=share_attachment';

    console.log('Testing FacebookFetch function...');
    try {
        const result = await instaFetch(testUrl);
        console.log('Media URL fetched:', result);
    } catch (error) {
        console.error('Test failed:', error.message);
    }
})();