import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Bulk Sender. All rights reserved.</p>
                <p className="text-sm">Built with ❤️ using React and Tailwind CSS</p>
            </div>
        </footer>
    );
};

export default Footer;