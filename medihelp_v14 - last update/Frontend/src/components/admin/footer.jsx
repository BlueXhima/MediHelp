import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-card text-foreground py-4 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} MediHelp. All rights reserved.
                </p>
                <p className="text-sm mt-1">
                    Built with care to empower healthcare for everyone, everywhere.
                </p>
            </div>
        </footer>
    );
}

export default Footer;