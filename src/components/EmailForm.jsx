import React, { useState } from "react";
import emailjs from "emailjs-com";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setShareableLink("");

    const emailArray = emails.split(/[\s,]+/);
    const historyId = generateRandomId();
    const currentDate = new Date().toISOString().split("T")[0];

    try {
      for (const email of emailArray) {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          from_name: senderName,
          to_name: email,
          subject: subject,
          message: message,
        });
      }

      await saveEmailHistory(
        historyId,
        currentDate,
        subject,
        message,
        senderName,
        emailArray
      );
      setSuccess("Emails sent successfully!");
      setShareableLink(`/history/${historyId}/${currentDate}`);
    } catch (err) {
      setError("Failed to send emails. Please try again.");
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
        <input
          type="text"
          placeholder="Recipient Emails (comma or space separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          required
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
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && (
        <div className="mt-4">
          <p className="text-green-500">{success}</p>
          <p className="mt-2">
            Shareable Link:{" "}
            <a href={shareableLink} className="text-blue-500">
              {shareableLink}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
