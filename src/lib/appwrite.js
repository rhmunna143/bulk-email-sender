// Get Appwrite from global scope (window)
const { Client, Databases, ID } = window.Appwrite;

// Initialize client
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('683b1c9800181588403e');

// Initialize services
const databases = new Databases(client);

// Constants
const DATABASE_ID = 'YOUR_DATABASE_ID';
const COLLECTION_ID = 'YOUR_COLLECTION_ID';

export { client, databases };
export { DATABASE_ID, COLLECTION_ID };

// Helper functions
export const saveEmailHistory = async (historyId, date, subject, message, senderName, recipients) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                historyId,
                date,
                subject,
                message,
                senderName,
                recipients: JSON.stringify(recipients),
            }
        );
    } catch (error) {
        console.error('Appwrite error:', error);
        throw error;
    }
};

export const fetchEmailHistory = async (historyId, date) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                `historyId=${historyId}`,
                `date=${date}`
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Appwrite error:', error);
        throw error;
    }
};