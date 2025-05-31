import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite';

const Histories = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupedHistories, setGroupedHistories] = useState({});

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                setLoading(true);
                // Fetch all documents from the collection
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID
                );
                
                setHistories(response.documents);
                
                // Group histories by date
                const grouped = {};
                response.documents.forEach(doc => {
                    if (!grouped[doc.date]) {
                        grouped[doc.date] = [];
                    }
                    grouped[doc.date].push(doc);
                });
                
                setGroupedHistories(grouped);
            } catch (err) {
                console.error("Error fetching histories:", err);
                setError("Failed to load email histories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (histories.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Email Histories</h1>
                <div className="bg-gray-50 border border-gray-200 p-6 rounded text-center">
                    <p className="text-gray-500">No email histories found. Send some emails first!</p>
                    <Link to="/" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Send Emails
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Email Histories</h1>
            
            {Object.entries(groupedHistories)
                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                .map(([date, entries]) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">{new Date(date).toLocaleDateString()}</h2>
                        <div className="space-y-4">
                            {/* Group by historyId */}
                            {Object.entries(
                                entries.reduce((acc, entry) => {
                                    if (!acc[entry.historyId]) {
                                        acc[entry.historyId] = [];
                                    }
                                    acc[entry.historyId].push(entry);
                                    return acc;
                                }, {})
                            ).map(([historyId, historyEntries]) => {
                                // Take first entry for display
                                const firstEntry = historyEntries[0];
                                const recipientCount = JSON.parse(firstEntry.recipients).length;
                                
                                return (
                                    <div key={historyId} className="border rounded-lg shadow-sm p-4 hover:bg-gray-50">
                                        <Link 
                                            to={`/history/${historyId}/${date}`} 
                                            className="block"
                                        >
                                            <h3 className="font-medium text-blue-600">{firstEntry.subject}</h3>
                                            <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-4">
                                                <span>From: {firstEntry.senderName}</span>
                                                <span>Recipients ({recipientCount}): {
                                                    JSON.parse(firstEntry.recipients)
                                                        .slice(0, 3)
                                                        .join(", ")
                                                    }
                                                    {recipientCount > 3 && `... and ${recipientCount - 3} more`}
                                                </span>
                                                <span>Time: {new Date(firstEntry.$createdAt).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="mt-2 line-clamp-2 text-sm text-gray-600">
                                                {firstEntry.message}
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default Histories;