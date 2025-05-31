import React from 'react';

const CopyLinkButton = ({ link }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <button 
            onClick={copyToClipboard} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
            Copy Link
        </button>
    );
};

export default CopyLinkButton;