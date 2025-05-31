import React from 'react';
import EmailForm from '../components/EmailForm';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex items-center justify-center p-4">
                <EmailForm />
            </main>
        </div>
    );
};

export default Home;