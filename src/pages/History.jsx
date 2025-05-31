import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEmailHistory } from "../lib/appwrite";

const History = () => {
  const { historyId, date } = useParams();
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEmailHistory = async () => {
      try {
        setLoading(true);
        const documents = await fetchEmailHistory(historyId, date);
        setEmailHistory(documents);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load email history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getEmailHistory();
  }, [historyId, date]);

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
        <Link to="/history" className="mt-4 inline-block text-blue-500">
          ← Back to all histories
        </Link>
      </div>
    );
  }

  if (emailHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Email History</h1>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-yellow-700">
            No emails found for this history ID on {date}.
          </p>
        </div>
        <Link to="/history" className="mt-4 inline-block text-blue-500">
          ← Back to all histories
        </Link>
      </div>
    );
  }

  // Take the first entry to display sender and subject info
  const firstEmail = emailHistory[0];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link to="/history" className="text-blue-500 hover:underline">
          ← Back to all histories
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{firstEmail.subject}</h1>
        <div className="text-sm text-gray-500 mb-4">
          <p>From: {firstEmail.senderName}</p>
          <p>Date: {new Date(date).toLocaleDateString()}</p>
          <p>Total Recipients: {JSON.parse(firstEmail.recipients).length}</p>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="font-semibold mb-2">Message:</h2>
          {/* subject */}
          <div>
            <h3 className="p-2 font-medium mb-2 bg-gray-50">
              Subject: {firstEmail.subject}
            </h3>
          </div>
          <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
            {firstEmail.message}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="font-semibold mb-2">Recipients:</h2>
          <div className="bg-gray-50 p-4 rounded">
            <ul className="list-disc pl-5 space-y-1">
              {JSON.parse(firstEmail.recipients).map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
