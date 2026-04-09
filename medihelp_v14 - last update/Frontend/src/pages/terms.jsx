import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Terms = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Store the referring page in session storage if not already set
        if (!sessionStorage.getItem('referrer')) {
            sessionStorage.setItem('referrer', location.state?.from || '/');
        }
    }, [location]);

    const handleBack = () => {
        // Navigate to the referring page stored in session storage
        const referrer = sessionStorage.getItem('referrer') || '/';
        navigate(referrer);
    };

    const sections = {
        introduction: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Terms and Conditions</h1>
                    <p className="text-left">
                        Welcome to MediHelp – Voice-Assisted Healthcare Information System (“MediHelp,” “we,” “our,” or “us”).
                    </p>
                    <p className="text-sm text-left mt-4">Last Updated: February 27, 2026</p>
                </div>
                <p className="text-gray-700 leading-relaxed text-left">
                    These Terms and Conditions (“Terms”) govern your access to and use of the MediHelp website, including its voice-assisted features, text-based interaction tools, accessibility functionalities, and related services (collectively, the “Platform”).
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    MediHelp is an accessible, web-based healthcare information system designed to provide users with general medical knowledge, health education resources, and wellness information through voice commands and text queries. The Platform is developed to enhance accessibility, particularly for individuals with specific disability needs, by integrating assistive interaction features and user-friendly content delivery.
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    These Terms establish the legally binding agreement between you (“User,” “you,” or “your”) and MediHelp regarding your use of the Platform. By accessing, browsing, or using MediHelp in any manner, you acknowledge that you have read, understood, and agreed to be bound by these Terms, as well as any related policies referenced herein.
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    If you do not agree to these Terms, you must immediately discontinue use of the Platform.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md">
                    <h3 className="text-lg font-semibold text-blue-700 text-left">Your use of MediHelp signifies your acceptance of:</h3>
                    <ul className="list-disc pl-8 text-gray-700 mt-2 space-y-2 text-left">
                        <li>The informational and non-clinical nature of the Platform</li>
                        <li>The limitations of automated health information systems</li>
                        <li>The responsibilities associated with interpreting general medical content</li>
                        <li>The security and usage conditions described in this document</li>
                    </ul>
                </div>
                <p className="text-gray-700 leading-relaxed text-left">
                    MediHelp reserves the right to modify, update, or revise these Terms at any time to reflect system improvements, regulatory updates, operational changes, or legal requirements. Continued use of the Platform after such modifications constitutes your acceptance of the updated Terms.
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    These Terms apply to all users, including casual visitors, registered users (if applicable), and individuals accessing the Platform through assistive technologies.
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    If you have any questions about these Terms, you should contact MediHelp before using the Platform.
                </p>
            </section>
        ),
        acceptanceOfTerms: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Acceptance of Terms</h1>
                    <p className="text-left">
                        By accessing, browsing, or using MediHelp, including its voice-assisted features, text-based query system, accessibility tools, and related functionalities (collectively, the “Platform”), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions.
                    </p>
                </div>
                <p className="text-gray-700 leading-relaxed text-left">
                    Your agreement becomes effective immediately upon your first use of the Platform. Continued use of MediHelp constitutes ongoing acceptance of these Terms, including any future updates or modifications.
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    If you do not agree to these Terms, in whole or in part, you must not access or use the Platform.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md text-left">
                    <h3 className="text-lg font-semibold text-blue-700">By using MediHelp, you further represent and warrant that:</h3>
                    <ul className="list-disc pl-8 text-gray-700 mt-2 space-y-2">
                        <li>You have the legal capacity to enter into a binding agreement under applicable law;</li>
                        <li>You are at least eighteen (18) years of age, or you are accessing the Platform under the supervision of a parent or legal guardian;</li>
                        <li>You will comply with all applicable laws, regulations, and ethical standards when using the Platform;</li>
                        <li>You understand that MediHelp provides general health information only and does not offer medical diagnosis, treatment, or professional medical advice.</li>
                    </ul>
                </div>
                <p className="text-gray-700 leading-relaxed text-left">
                    If you are using MediHelp on behalf of an organization, institution, or other legal entity, you represent that you have the authority to bind that entity to these Terms. In such cases, “you” and “your” refer to both the individual user and the represented entity.
                </p>
                <p className="text-gray-700 leading-relaxed text-left">
                    MediHelp reserves the right to deny or restrict access to any user who violates these Terms or uses the Platform in a manner inconsistent with its intended purpose.
                </p>
            </section>
        ),
        descriptionOfService: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Description of Service</h1>
                    <p className="text-left">
                        MediHelp is a web-based, voice-assisted healthcare information system designed to provide users with access to general medical knowledge and health-related educational content. The Platform enables users to submit questions through voice commands or text input and receive automated informational responses in a clear, accessible format.
                    </p>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">3.1 Purpose of the Platform</h2>
					<h3 className="text-gray-800" >The primary purpose of MediHelp is to:</h3>
					<ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Provide general health information about illnesses, symptoms, prevention, wellness, and healthy lifestyle practices</li>
                        <li>Improve accessibility to healthcare information through voice-assisted interaction</li>
                        <li>Support users who may have visual, reading, or other accessibility-related challenges</li>
                        <li>Deliver structured and understandable medical knowledge for educational purposes</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                        MediHelp is intended solely as an informational and educational tool and does not function as a healthcare provider.
                    </p>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">3.2 Core Functional Modules</h2>
					<h3 className="text-gray-800" >The Platform operates using a modular system architecture that may include, but is not limited to:</h3>
					<ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Voice and Text Input Module: Processes user queries submitted via speech recognition or typed input</li>
                        <li>Information Retrieval and Response Module: Generates responses based on structured medical knowledge sources and programmed logic</li>
                        <li>Accessibility Module: Enhances usability through assistive features such as voice feedback, readable formatting, and adjustable interface elements</li>
                        <li>Security and Deployment Module: Supports system protection, performance monitoring, and service reliability</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                        These components work together to deliver automated responses based on user-submitted questions.
                    </p>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">3.3 Nature of Responses</h2>
					<h3 className="text-gray-800" >Responses provided by MediHelp:</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Are automatically generated</li>
                        <li>Are based on general medical and health information</li>
                        <li>May not account for individual medical history or personal conditions</li>
                        <li>Should not be interpreted as professional medical advice</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                        The Platform does not conduct physical examinations, clinical assessments, diagnostic testing, or real-time medical monitoring.
                    </p>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">3.4 Service Limitations</h2>
					<h3 className="text-gray-800" >MediHelp does not:</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Provide medical diagnoses</li>
                        <li>Prescribe medication or treatment</li>
                        <li>Offer emergency medical assistance</li>
                        <li>Schedule medical appointments</li>
                        <li>Store or manage formal medical records</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                        The Platform should not be used as a substitute for consultation with licensed healthcare professionals.
                    </p>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">3.5 Service Availability</h2>
                    <p className="text-gray-700 leading-relaxed">
                        While reasonable efforts are made to ensure reliability and accessibility, MediHelp does not guarantee uninterrupted, error-free, or continuous availability of the Platform. Service functionality may be affected by maintenance, updates, technical limitations, or external service dependencies.
                    </p>
                </div>
            </section>
        ),
        medicalDisclaimer: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Medical Disclaimer</h1>
                    <p className="text-left">
                        The information provided by MediHelp is for general informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition or health concern.
                    </p>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">4.1 Informational Purposes Only</h2>
                    <div className="text-gray-700 leading-relaxed space-y-2">
						<p>
							<strong>MediHelp</strong> is an educational and informational platform. 
							All content, responses, and materials provided through the Platform—
							whether delivered via voice assistance or text—are intended solely for 
							general health education purposes.
						</p>
						<p>
							<em>Important:</em> The information provided does <strong>not </strong> 
							constitute medical advice, clinical diagnosis, therapeutic recommendation, 
							or professional healthcare services.
						</p>
					</div>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">4.2 No Doctor–Patient Relationship</h2>
					<div className="text-gray-700 leading-relaxed space-y-2">
						<p>
							Use of <strong>MediHelp</strong> does not establish a 
							<strong> doctor–patient relationship</strong>, 
							<strong> provider–patient relationship</strong>, 
							or any other fiduciary or confidential medical relationship 
							between you and MediHelp, its developers, operators, or affiliates.
						</p>
					</div>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">4.3 Not a Substitute for Professional Care</h2>
					<div className="text-gray-700 leading-relaxed space-y-2">
						<p>
							Information obtained through <strong>MediHelp</strong> is not a substitute 
							for consultation with a qualified healthcare professional. You should always 
							seek the advice of a licensed physician or other qualified medical provider 
							regarding:
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Medical conditions</li>
							<li>Symptoms</li>
							<li>Treatment options</li>
							<li>Medication decisions</li>
							<li>Preventive care</li>
						</ul>
						<p className="font-semibold">
							Never disregard professional medical advice or delay seeking it because of 
							information obtained from the Platform.
						</p>
					</div>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">4.4 No Diagnosis or Treatment</h2>
					<div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>MediHelp does not:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Diagnose medical conditions</li>
							<li>Interpret medical test results</li>
							<li>Prescribe medications</li>
							<li>Recommend specific treatments tailored to individual users</li>
							<li>Provide emergency medical assistance</li>
						</ul>
						<p className="font-semibold">
							Responses are generated automatically and are based on general medical knowledge. 
							They may not consider your complete medical history, underlying conditions, allergies, 
							or other critical health factors.
						</p>
					</div>
                </div>
                <div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">4.5 Emergency Situations</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>MediHelp is not designed for emergency use.</strong>
						</p>
						<p>
							If you believe you are experiencing a medical emergency, including but not limited to:
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Severe symptoms</li>
							<li>Chest pain</li>
							<li>Difficulty breathing</li>
							<li>Loss of consciousness</li>
							<li>Any life-threatening condition</li>
						</ul>
						<p>
							<strong>Take immediate action:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Contact your local emergency services immediately</li>
							<li>Seek care from the nearest licensed medical facility</li>
						</ul>
						<p className="font-semibold">
							Do not rely on MediHelp for urgent or emergency medical needs.
						</p>
					</div>
                </div>
				<div className="space-y-4 text-left">
					<h2 className="text-2xl font-semibold text-gray-800">4.6 Accuracy and Evolving Medical Knowledge</h2>
					<div className="text-gray-700 leading-relaxed space-y-3">
						<p>
							<strong>Medical knowledge continuously evolves.</strong> While reasonable efforts 
							are made to provide accurate and up-to-date information, <strong>MediHelp</strong> 
							does not guarantee that all content is current, complete, or free from errors.
						</p>
						<p className="font-semibold">
							You acknowledge that reliance on any information provided by the Platform is 
							solely at your own risk.
						</p>
					</div>
				</div>
            </section>
        ),
        eligibilityAndResponsibilities: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Eligibility and User Responsibilities</h1>
                    <p className="text-left">
                        To access and use MediHelp, you must meet the following eligibility criteria and agree to uphold certain responsibilities:
					</p>
                </div>
				<div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">5.1 Eligibility</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>Eligibility Requirements:</strong> To use MediHelp, you must meet the following conditions:
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>You must be at least eighteen (18) years of age; or</li>
							<li>If under eighteen (18), you must use the Platform under the supervision and consent of a parent or legal guardian;</li>
							<li>You must have the legal capacity to enter into a binding agreement under applicable law;</li>
							<li>You must not be prohibited from using the Platform under any applicable laws or regulations.</li>
						</ul>
						<p>
							By accessing or using <strong>MediHelp</strong>, you represent and warrant that you meet these eligibility requirements.
						</p>
						<p className="font-semibold">
							If MediHelp becomes aware that a user does not meet these conditions, access to the Platform may be restricted or terminated.
						</p>
					</div>
                </div>
				<div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">5.2 User Responsibilities</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>Responsible Use:</strong> By using the Platform, you agree to use MediHelp responsibly, lawfully, and in accordance with these Terms.
						</p>
						<p>You agree that you will:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Provide accurate and truthful information when submitting queries</li>
							<li>Use the Platform solely for lawful and informational purposes</li>
							<li>Exercise independent judgment when interpreting health-related information provided</li>
							<li>Seek professional medical advice before making healthcare decisions</li>
							<li>Refrain from using the Platform for emergency medical situations</li>
						</ul>
						<p className="font-semibold">
							You acknowledge that you are solely responsible for how you interpret, rely upon, and act on information obtained through MediHelp.
						</p>
					</div>
                </div>
				<div className="space-y-4 text-left">
					<h2 className="text-2xl font-semibold text-gray-800">5.3 Responsible Use of Health Information</h2>
					<div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>You understand that:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>The Platform provides general medical knowledge and not individualized medical evaluation</li>
							<li>Automated responses may not account for your personal medical history or unique health circumstances</li>
							<li>Decisions regarding diagnosis, treatment, or medication must be made in consultation with a licensed healthcare professional</li>
						</ul>
						<p className="font-semibold">
							Any actions you take based on information from MediHelp are undertaken at your own discretion and risk.
						</p>
					</div>
				</div>
				<div className="space-y-4 text-left">
					<h2 className="text-2xl font-semibold text-gray-800">5.4 Technical and Security Responsibilities</h2>
					<div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>You agree not to:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Attempt to gain unauthorized access to system components</li>
							<li>Interfere with the Platform’s security features</li>
							<li>Introduce malicious code, viruses, or harmful content</li>
							<li>Use automated systems to extract data without authorization</li>
							<li>Engage in activities that may disrupt system performance or reliability</li>
						</ul>
						<p className="font-semibold">
							You are responsible for maintaining the security of any device used to access the Platform.
						</p>
					</div>
				</div>
            </section>
        ),
        permittedAndProhibitedUse: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Permitted and Prohibited Use</h1>
                    <p className="text-left">
                        When using MediHelp, you are expected to adhere to the following guidelines regarding permitted and prohibited activities:
					</p>
                </div>
				<div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">6.1 Permitted Use</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>License to Use:</strong> MediHelp grants you a limited, non-exclusive, non-transferable, and revocable right to access and use the Platform strictly for lawful, personal, and informational purposes.
						</p>
						<p>You may use the Platform to:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Submit general health-related questions through voice or text input</li>
							<li>Access educational content regarding illnesses, symptoms, prevention, and wellness</li>
							<li>Utilize accessibility features designed to enhance usability</li>
							<li>Review and learn from health-related information for personal knowledge and awareness</li>
						</ul>
						<p className="font-semibold">
							All use must remain consistent with the intended purpose of MediHelp as an informational healthcare resource.
						</p>
					</div>
				</div>
				<div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">6.2 Probihited Use</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>You agree not to use MediHelp in any manner that:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Violates any applicable local, national, or international law or regulation</li>
							<li>Seeks medical diagnosis, emergency medical intervention, or treatment prescriptions</li>
							<li>Misrepresents the Platform as a licensed medical provider or diagnostic system</li>
							<li>Attempts to reverse engineer, decompile, or interfere with the Platform’s software architecture</li>
							<li>Attempts to bypass security measures or gain unauthorized access to restricted areas</li>
							<li>Introduces malware, viruses, malicious scripts, or harmful code</li>
							<li>Uses automated bots, scraping tools, or data-mining techniques without authorization</li>
							<li>Submits false, misleading, or intentionally harmful inputs</li>
							<li>Disrupts, overloads, or impairs the functionality of the Platform</li>
							<li>Uses the Platform for commercial exploitation without written authorization</li>
						</ul>
					</div>
				</div>
				<div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">6.3 Misuse of Health Information</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>You may not:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Use information obtained from MediHelp to provide unauthorized medical advice to others</li>
							<li>Present automated responses as certified clinical guidance</li>
							<li>Rely solely on Platform content for critical or life-threatening medical decisions</li>
						</ul>
					</div>
				</div>
				<div className="space-y-4 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">6.4 Enforcement</h2>
                    <div className="text-gray-700 leading-relaxed space-y-3">
						<p className="font-medium">
							<strong>MediHelp reserves the right to:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Monitor usage patterns for security and compliance purposes</li>
							<li>Investigate suspected violations</li>
							<li>Suspend or terminate access without prior notice if misuse is detected</li>
							<li>Take appropriate legal action where necessary</li>
						</ul>
						<p className="font-semibold">
							Enforcement actions may be taken at MediHelp’s sole discretion to protect system integrity, user safety, and legal compliance.
						</p>
					</div>
				</div>
            </section>
        ),
        accessibilityCommitment: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Accessibility Commitment</h1>
                    <p className="text-left">
                        MediHelp is committed to providing an accessible and inclusive platform for all users, including those with disabilities. We strive to ensure that our services are usable by individuals with a wide range of accessibility needs.
					</p>
                </div>
            </section>
        ),
        dataPrivacyAndSecurity: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Data Privacy and Security</h1>
                    <p className="text-left">
                        MediHelp takes data privacy and security seriously. We implement reasonable measures to protect user information, but we cannot guarantee absolute security. By using the Platform, you acknowledge and accept the risks associated with data transmission and storage.
					</p>
                </div>
            </section>
        ),
        intellectualPropertyRights: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Intellectual Property Rights</h1>
                    <p className="text-left">
                        All content on MediHelp is protected by intellectual property laws. Unauthorized use is prohibited.
					</p>
                </div>
            </section>
        ),
        accuracyOfInformation: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Accuracy of Information</h1>
                    <p className="text-left">
                        While we strive for accuracy, MediHelp does not guarantee the completeness or reliability of information provided.
					</p>
                </div>
            </section>
        ),
        thirdPartyServices: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Third-Party Services</h1>
                    <p className="text-left">
                        MediHelp may include links to third-party services. We are not responsible for their content or practices.
					</p>
                </div>
            </section>
        ),
        limitationOfLiability: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Limitation of Liability</h1>
                    <p className="text-left">
                        MediHelp is not liable for any damages arising from the use of our services, to the extent permitted by law.
					</p>
                </div>
            </section>
        ),
        indemnification: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Indemnification</h1>
                    <p className="text-left">
                        You agree to indemnify and hold MediHelp harmless from any claims arising from your use of the service.
					</p>
                </div>
            </section>
        ),
        serviceAvailabilityAndModifications: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Service Availability and Modifications</h1>
                    <p className="text-left">
                        MediHelp may modify or discontinue services at any time without prior notice.
					</p>
                </div>
            </section>
        ),
        terminationOfUse: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Termination of Use</h1>
                    <p className="text-left">
                        We reserve the right to terminate access to MediHelp for violations of these Terms.
					</p>
                </div>
            </section>
        ),
        governingLaw: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Governing Law</h1>
                    <p className="text-left">
                        These Terms are governed by the laws of the Philippines. Disputes will be resolved in accordance with local laws.
					</p>
                </div>
            </section>
        ),
        changesToTerms: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Changes to Terms</h1>
                    <p className="text-left">
                        MediHelp may update these Terms from time to time. Continued use constitutes acceptance of the updated Terms.
					</p>
                </div>
            </section>
        ),
        contactInformation: (
            <section className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6 rounded-md">
                    <h1 className="text-4xl font-bold mb-4 text-left">Contact Information</h1>
                    <p className="text-left">
                        For questions about these Terms, contact us at:
					</p>
                    <ul className="list-none mt-4 text-left">
                        <li>Email: <a href="mailto:support@medihelp.com" className="text-blue-200 hover:underline">support@medihelp.com</a></li>
                        <li>Phone: 1-800-MEDIHELP</li>
                        <li>Address: City of Bacoor, Cavite, Philippines</li>
                    </ul>
                </div>
            </section>
        ),
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-80 bg-white p-6 border-r border-gray-200 shadow-md sticky top-0 h-screen overflow-y-auto">
                <button
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-6 cursor-pointer"
                    onClick={handleBack}
                >
                    <ChevronLeft className="mr-2" size={20} /> Back
                </button>
                <nav>
                    <ul className="space-y-4">
                        {Object.keys(sections).map((key) => (
                            <li key={key}>
                                <button
                                    className={`w-full cursor-pointer text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                                        activeSection === key
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setActiveSection(key)}
                                >
                                    {key
                                        .replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, (str) => str.toUpperCase())}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 bg-white">
                {sections[activeSection]}
            </main>
        </div>
    );
};

export default Terms;