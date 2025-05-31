import React, { useEffect, useState } from 'react';
import { fetchEmailHistory } from '../lib/appwrite';
import { useParams } from 'react-router-dom';

const HistoryViewer = () => {
    const { historyId, date } = useParams();
    const [emailHistory, setEmailHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEmailHistory = async () => {
            try {
                const response = await fetchEmailHistory(historyId, date);
                setEmailHistory(response);
            } catch (err) {
                setError('Failed to fetch email history.');
            } finally {
                setLoading(false);
            }
        };

        getEmailHistory();
    }, [historyId, date]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Email History for {date}</h2>
            {emailHistory.length === 0 ? (
                <p>No emails found for this history ID on this date.</p>
            ) : (
                <ul>
                    {emailHistory.map((email) => (
                        <li key={email.$id} className="border-b py-2">
                            <p><strong>Sender:</strong> {email.senderName}</p>
                            <p><strong>Subject:</strong> {email.subject}</p>
                            <p><strong>Message:</strong> {email.message}</p>
                            <p><strong>Recipients:</strong> {email.recipients.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryViewer;