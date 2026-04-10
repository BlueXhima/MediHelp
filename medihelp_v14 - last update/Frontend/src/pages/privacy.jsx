import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [expandedSection, setExpandedSection] = useState('');
    const [previousActiveSection, setPreviousActiveSection] = useState('introduction'); // Track previous active section
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!sessionStorage.getItem('referrer')) {
            sessionStorage.setItem('referrer', location.state?.from || '/');
        }
    }, [location]);

    const handleBack = () => {
        const referrer = sessionStorage.getItem('referrer') || '/';
        navigate(referrer);
    };

    const sections = {
        introduction: (
            <section id="introduction" className="space-y-6">
                <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Privacy Policy</h1>
                    <p className="text-left">
                        Welcome to MediHelp – Voice-Assisted Healthcare Information System (“MediHelp,” “we,” “our,” or “us”).
                    </p>
                    <p className="text-sm text-left mt-4">Last Updated: February 27, 2026</p>
                </header>
                
                <div className="text-gray-700 leading-relaxed text-left space-y-4 px-2">
                    <p>
                        Your privacy is important to us. This Privacy Policy explains how MediHelp collects, processes, uses,
                        stores, and protects information when you access or use our web-based healthcare information platform,
                        including its voice-assisted features, text-based interaction tools, accessibility functionalities,
                        and related services (collectively, the “Platform”).
                    </p>

                    <p>
                        MediHelp is designed to provide general health information through accessible and user-friendly technology.
                        While the Platform enables users to submit health-related questions via voice or text, MediHelp does not
                        function as a healthcare provider, does not offer medical diagnosis, and does not replace professional
                        medical consultation. However, because users may share health-related information during interactions,
                        we recognize the importance of handling such information responsibly and transparently.
                    </p>

                    <p>
                        This Privacy Policy is intended to:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Clearly describe the types of information we may collect;</li>
                        <li>Explain how and why that information is processed;</li>
                        <li>Outline how we protect user data;</li>
                        <li>Inform users of their rights regarding their personal information;</li>
                        <li>Describe how we limit the collection and retention of health-related inputs.</li>
                    </ul>

                    <p>
                        By accessing or using MediHelp, you acknowledge that you have read and understood this Privacy Policy.
                        Your continued use of the Platform signifies your agreement to the practices described herein.
                    </p>

                    <p>
                        This Privacy Policy applies to:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>All visitors accessing the Platform;</li>
                        <li>Users submitting voice or text queries;</li>
                        <li>Individuals using accessibility features;</li>
                        <li>Any person interacting with MediHelp through supported devices or browsers.</li>
                    </ul>

                    <p>
                        This Policy should be read together with our Terms and Conditions. In the event of a conflict between
                        this Privacy Policy and the Terms and Conditions, the Terms and Conditions shall govern with respect
                        to Platform usage obligations, while this Policy governs data handling practices.
                    </p>

                    <p>
                        We are committed to:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Minimizing data collection to what is necessary for system functionality;</li>
                        <li>Avoiding the intentional collection of formal medical records;</li>
                        <li>Implementing reasonable technical and organizational safeguards;</li>
                        <li>Maintaining transparency about how automated systems process user queries.</li>
                    </ul>

                    <p>
                        Because MediHelp operates as a web-based platform, information may be transmitted over the internet.
                        While we implement security safeguards designed to protect user data, no method of electronic transmission
                        or storage can be guaranteed to be completely secure. Users acknowledge these inherent risks when using
                        the Platform.
                    </p>

                    <p>
                        If you do not agree with the terms of this Privacy Policy, you should discontinue use of MediHelp immediately.
                    </p>

                    <p>
                        For questions regarding this Privacy Policy or data practices, users may contact us using the information
                        provided in the Contact section of this document.
                    </p>
                </div>
            </section>
        ),
        scopeOfPolicy: (
            <section id="scope-of-policy" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Scope of This Policy
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    This policy applies to all users of MediHelp and outlines the data we collect and how it is used.
                </p>
            </section>
        ),
        informationWeCollect: {
            main: (
                <section id="information-we-collect" className="space-y-6">
                    <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                        Information We Collect
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-left">
                        We collect information to provide, maintain, and improve our services. Below are the types of information we collect:
                    </p>
                </section>
            ),
            subSections: {
                informationYouProvide: (
                    <section id="information-you-provide" className="space-y-6">
                        <h4 className="text-xl text-left font-semibold text-foreground mb-4">
                            Information You Provide
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-left">
                            Details about the information you provide directly to us.
                        </p>
                    </section>
                ),
                automaticallyCollectedInformation: (
                    <section id="automatically-collected-information" className="space-y-6">
                        <h4 className="text-xl text-left font-semibold text-foreground mb-4">
                            Automatically Collected Information
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-left">
                            Information collected automatically when you use our services.
                        </p>
                    </section>
                ),
                voiceDataProcessing: (
                    <section id="voice-data-processing" className="space-y-6">
                        <h4 className="text-xl text-left font-semibold text-foreground mb-4">
                            Voice Data Processing
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-left">
                            How we process voice data to improve our services.
                        </p>
                    </section>
                )
            }
        },
        howWeUseYourInformation: (
            <section id="how-we-use-your-information" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    How We Use Your Information
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Explanation of how your information is used to provide and improve our services.
                </p>
            </section>
        ),
        legalBasisForProcessing: (
            <section id="legal-basis-for-processing" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Legal Basis for Processing (If Applicable)
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    The legal basis for processing your personal data under applicable laws.
                </p>
            </section>
        ),
        healthRelatedInformationDisclaimer: (
            <section id="health-related-information-disclaimer" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Health-Related Information Disclaimer
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Disclaimer regarding health-related information provided by MediHelp.
                </p>
            </section>
        ),
        dataStorageAndRetention: (
            <section id="data-storage-and-retention" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Data Storage and Retention
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Information about how long we store your data and our retention policies.
                </p>
            </section>
        ),
        dataSecurityMeasures: (
            <section id="data-security-measures" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Data Security Measures
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Steps we take to protect your data from unauthorized access and breaches.
                </p>
            </section>
        ),
        dataSharingAndDisclosure: (
            <section id="data-sharing-and-disclosure" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Data Sharing and Disclosure
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    How and when we share your data with third parties.
                </p>
            </section>
        ),
        thirdPartyServiceProviders: (
            <section id="third-party-service-providers" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Third-Party Service Providers
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Information about third-party services we use and their role in data processing.
                </p>
            </section>
        ),
        cookiesAndTrackingTechnologies: (
            <section id="cookies-and-tracking-technologies" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Cookies and Tracking Technologies
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    How we use cookies and other tracking technologies to enhance your experience.
                </p>
            </section>
        ),
        userRightsAndChoices: (
            <section id="user-rights-and-choices" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    User Rights and Choices
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Your rights regarding your data and how you can exercise them.
                </p>
            </section>
        ),
        childrensPrivacy: (
            <section id="childrens-privacy" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Children’s Privacy
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Our policies regarding the privacy of children under applicable laws.
                </p>
            </section>
        ),
        internationalDataTransfers: (
            <section id="international-data-transfers" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    International Data Transfers
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    How we handle data transfers across international borders.
                </p>
            </section>
        ),
        accessibilityAndPrivacy: (
            <section id="accessibility-and-privacy" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Accessibility and Privacy
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Our commitment to ensuring accessibility while maintaining privacy.
                </p>
            </section>
        ),
        dataBreachProcedures: (
            <section id="data-breach-procedures" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Data Breach Procedures
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Steps we take in the event of a data breach.
                </p>
            </section>
        ),
        changesToPolicy: (
            <section id="changes-to-policy" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Changes to This Privacy Policy
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    Updates and changes to this Privacy Policy will be communicated here.
                </p>
            </section>
        ),
        contactInformation: (
            <section id="contact-information" className="space-y-6">
                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                    Contact Information
                </h3>
                <p className="text-gray-700 leading-relaxed text-left">
                    How to contact us regarding this Privacy Policy.
                </p>
            </section>
        )
    };

    const handleSectionClick = (key) => {
        if (expandedSection === key) {
            setExpandedSection('');
            setActiveSection('introduction'); // Revert to the default section
        } else {
            setExpandedSection(key);
            setPreviousActiveSection(activeSection); // Update the previous active section
            setActiveSection(key);
        }
    };

    const handleSubSectionClick = (subKey) => {
        if (activeSection === subKey) {
            setActiveSection('informationWeCollect'); // Revert to main section
        } else {
            setActiveSection(subKey); // Set active sub-section
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-80 bg-white p-6 border-r border-gray-200 shadow-md sticky top-0 h-screen overflow-y-auto">
                <button
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-6 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="mr-2" size={20} /> Back
                </button>
                <nav>
                    <ul className="space-y-4">
                        {Object.entries(sections).map(([key, value]) => (
                            <li key={key}>
                                {key === 'informationWeCollect' ? (
                                    <>
                                        <button
                                            className={`w-full cursor-pointer text-left px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center ${
                                                expandedSection === key
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                            onClick={() => handleSectionClick(key)}
                                        >
                                            {key
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, (str) => str.toUpperCase())}
                                            <span className={`transform transition-transform ${expandedSection === key ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {expandedSection === key && value.subSections && (
                                            <ul className="pl-4 space-y-4 mt-4">
                                                {Object.keys(value.subSections).map((subKey) => (
                                                    <li key={subKey}>
                                                        <button
                                                            className={`w-full cursor-pointer text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                                                                activeSection === subKey
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                            onClick={() => handleSubSectionClick(subKey)}
                                                        >
                                                            {subKey
                                                                .replace(/([A-Z])/g, ' $1')
                                                                .replace(/^./, (str) => str.toUpperCase())}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        className={`w-full cursor-pointer text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                                            activeSection === key
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleSectionClick(key)}
                                    >
                                        {key
                                            .replace(/([A-Z])/g, ' $1')
                                            .replace(/^./, (str) => str.toUpperCase())}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {activeSection === 'informationWeCollect' && sections[activeSection]?.main}
                {activeSection !== 'informationWeCollect' && sections.informationWeCollect?.subSections?.[activeSection]}
                {activeSection !== 'informationWeCollect' && !sections.informationWeCollect?.subSections?.[activeSection] && sections[activeSection]}
            </main>
        </div>
    );
};

export default PrivacyPolicy;