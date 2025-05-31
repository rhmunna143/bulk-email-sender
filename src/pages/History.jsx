import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../lib/appwrite';

const History = () => {
    const { historyId, date } = useParams();
    const [emailHistory, setEmailHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmailHistory = async () => {
            setLoading(true);
            try {
                const response = await client.database.listDocuments('your_database_id', 'your_collection_id', [
                    Query.equal('historyId', historyId),
                    Query.equal('date', date)
                ]);
                setEmailHistory(response.documents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmailHistory();
    }, [historyId, date]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Email History for {date}</h1>
            {emailHistory.length === 0 ? (
                <p>No emails found for this history ID on this date.</p>
            ) : (
                <ul className="space-y-4">
                    {emailHistory.map((email) => (
                        <li key={email.$id} className="border p-4 rounded shadow">
                            <h2 className="font-semibold">{email.subject}</h2>
                            <p><strong>From:</strong> {email.senderName}</p>
                            <p><strong>To:</strong> {email.recipientEmails.join(', ')}</p>
                            <p><strong>Message:</strong> {email.message}</p>
                            <p className="text-gray-500 text-sm">{new Date(email.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;