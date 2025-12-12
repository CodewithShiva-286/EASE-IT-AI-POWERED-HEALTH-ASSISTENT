// Add your API call functions here

/**
 * Generic fetch wrapper for making API calls
 * @param {string} url - The endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
