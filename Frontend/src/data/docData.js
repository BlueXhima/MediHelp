export const docData = {
    'getting-started': {
        title: 'Getting Started',
        sections: [
            { type: 'text', content: 'MediHelp is designed to be your all-in-one health companion, providing seamless access to medical services and personal health management.' },
            { type: 'heading', content: 'Initial Setup' },
            { type: 'list', content: [
                'Profile Completion: Navigate to your settings to update your health profile. Providing accurate information ensures better hospital recommendations.',
                'Dashboard Overview: Your dashboard centralizes your upcoming appointments, medical records, and quick-access tools.',
                'Security Check: We highly recommend enabling Two-Factor Authentication (2FA) in your account security settings to protect your sensitive data.'
            ]}
        ]
    },
    'api-reference': {
        title: 'API Reference',
        sections: [
            { type: 'text', content: 'Our API is built for high availability, security, and scalability, allowing developers to integrate MediHelp features into third-party health applications.' },
            { type: 'heading', content: 'Authentication' },
            { type: 'text', content: 'All requests must be authenticated using an OAuth 2.0 Bearer Token. Ensure your API keys are stored in environment variables and never exposed on the client-side.' },
            { type: 'heading', content: 'Endpoint Categories' },
            { type: 'list', content: [
                '/hospitals: Retrieve real-time data on nearby healthcare facilities, including bed availability and service specializations.',
                '/records: Securely manage and fetch your encrypted medical history logs.',
                '/symptoms: Access the diagnostic engine to process symptom tracking data for preliminary analysis.',
                '/notifications: Configure push alerts for upcoming medical appointments and health reminders.'
            ]}
        ]
    },
    'user-guides': {
        title: 'User Guides',
        sections: [
            { type: 'text', content: 'Mastering the MediHelp platform is easy with our step-by-step feature walkthroughs.' },
            { type: 'heading', content: 'Hospital Mapping' },
            { type: 'text', content: 'Use the interactive map to filter hospitals by proximity, specialization, and current bed capacity. You can also view hospital contact details and patient ratings.' },
            { type: 'heading', content: 'Symptom Checker' },
            { type: 'text', content: 'Our AI-driven symptom checker provides preliminary analysis based on user input. Important: This is not a substitute for professional medical advice. Always consult a licensed professional for formal diagnoses.' },
            { type: 'heading', content: 'Medical Records' },
            { type: 'text', content: 'Upload scans or PDFs of your lab results. Our system automatically categorizes these files, making them easily searchable and accessible during your doctor visits.' }
        ]
    },
    'privacy-security': {
        title: 'Privacy & Security',
        sections: [
            { type: 'text', content: 'Protecting your health data is our highest priority. We use industry-standard protocols to ensure your information remains private and secure.' },
            { type: 'heading', content: 'Encryption Standards' },
            { type: 'list', content: [
                'Data at Rest: All health records are encrypted using AES-256 standard.',
                'Data in Transit: All communication between your device and our servers is secured via TLS 1.3 protocol.'
            ]},
            { type: 'heading', content: 'Compliance' },
            { type: 'text', content: 'MediHelp is fully compliant with global data protection regulations, including HIPAA and GDPR. We strictly prohibit the sale or unauthorized sharing of your personal health information to third-party advertisers.' }
        ]
    },
    'accessibility': {
        title: 'Accessibility',
        sections: [
            { type: 'text', content: 'We are committed to making healthcare technology inclusive for everyone, regardless of physical or visual ability.' },
            { type: 'heading', content: 'Core Accessibility Features' },
            { type: 'list', content: [
                'Screen Reader Support: Full compatibility with NVDA, JAWS, and VoiceOver.',
                'Keyboard Navigation: The entire application can be navigated without the use of a mouse.',
                'High Contrast Mode: An optimized visual theme for users with low vision or color blindness.',
                'Adaptive Typography: Support for browser-level font resizing without breaking layout integrity.'
            ]}
        ]
    },
    'release-notes': {
        title: 'Release Notes',
        sections: [
            { type: 'text', content: 'Stay updated with the latest improvements, new feature releases, and critical bug fixes.' },
            { type: 'heading', content: 'Version 2.1.0 (Latest)' },
            { type: 'list', content: [
                'Improved hospital map loading speeds by 40%.',
                'Added native support for exporting medical records to PDF.',
                'Fixed intermittent bugs in the symptom checker diagnostic engine.',
                'Enhanced UI responsiveness on mobile devices.'
            ]}
        ]
    }
};