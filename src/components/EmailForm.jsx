import React, { useState } from "react";
import dayjs from "dayjs";
import { saveEmailHistory } from "../lib/appwrite";
import { generateRandomId } from "../utils/utils";

const EmailForm = () => {
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  const [stats, setStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setShareableLink("");
    setStats(null);

    const emailArray = emails.split(/[\s,]+/).filter((email) => email.trim() !== "");
    const historyId = generateRandomId();
    const currentDate = dayjs().format("YYYY-MM-DD");

    try {
      // Send emails using backend
      const response = await fetch("https://bulk-email-sender-three.vercel.app/send-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName,
          subject,
          message,
          recipients: emailArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send emails");
      }

      // Save to Appwrite
      await saveEmailHistory(historyId, currentDate, subject, message, senderName, emailArray);

      setSuccess(`Emails processed successfully!`);
      setStats({
        sent: data.sent,
        failed: data.failed,
      });
      setShareableLink(`/history/${historyId}/${currentDate}`);
    } catch (err) {
      setError(`Error: ${err.message || "Failed to send emails. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Send Bulk Emails</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Sender's Name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Recipient Emails (comma or space separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          required
          rows={3}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-600 font-medium">{success}</p>

          {stats && (
            <div className="mt-2 text-sm text-gray-600">
              <p>✅ {stats.sent} emails sent successfully</p>
              {stats.failed > 0 && <p>❌ {stats.failed} emails failed to send</p>}
            </div>
          )}

          <div className="mt-3">
            <p className="font-medium">Shareable Link:</p>
            <div className="flex items-center mt-1">
              <input
                type="text"
                readOnly
                value={window.location.origin + shareableLink}
                className="flex-grow p-2 text-sm bg-white border rounded-l"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + shareableLink);
                  alert("Link copied to clipboard!");
                }}
                className="bg-gray-100 border border-l-0 rounded-r p-2 hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
