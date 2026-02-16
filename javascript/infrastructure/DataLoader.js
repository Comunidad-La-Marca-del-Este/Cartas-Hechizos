/**
 * Helper to fetch and parse JSON data from a URL.
 */
class DataLoader {
    static async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("DataLoader error:", error);
            throw error;
        }
    }
}
