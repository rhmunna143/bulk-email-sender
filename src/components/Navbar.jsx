import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl font-bold">Bulk Email Sender</h1>
                <div>
                    <Link to="/" className="text-white px-4">Home</Link>
                    <Link to="/history" className="text-white px-4">History</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;