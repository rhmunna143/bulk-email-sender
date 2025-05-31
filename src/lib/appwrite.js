// Get Appwrite from global scope (window)
const { Client, Databases, ID, Query } = window.Appwrite;

// Initialize client
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('683b1c9800181588403e');

// Initialize services
const databases = new Databases(client);

// Constants
const DATABASE_ID = '683b2ed40005dd7ec2e4';
const COLLECTION_ID = '683b2f23002ad74c11fe';

export { client, databases };
export { DATABASE_ID, COLLECTION_ID };

// Helper functions
export const saveEmailHistory = async (historyId, date, subject, message, senderName, recipients) => {
    try {
        // Adjust these field names to match what exists in your collection
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                // Example - replace with your actual field names
                historyId: historyId,
                date: date,
                subject: subject,
                message: message,
                senderName: senderName,
                recipients: JSON.stringify(recipients),
            }
        );
    } catch (error) {
        console.error('Appwrite error:', error);
        throw error;
    }
};

// Also update the query parameters to match field names
export const fetchEmailHistory = async (historyId, date) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                // Correct way to filter with Appwrite queries
                Query.equal('historyId', historyId),
                Query.equal('date', date)
            ]
        );
        console.log("Fetched documents:", response.documents); // Add this for debugging
        return response.documents;
    } catch (error) {
        console.error('Appwrite error:', error);
        throw error;
    }
};