// src/utils/utils.js

// Generate a random ID similar to Firebase's unique IDs
export const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 20;
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Parse comma or space separated emails into array
export const parseEmails = (emailString) => {
    return emailString.split(/[\s,]+/).filter(email => email.trim() !== '');
};