import { Compass, MapPin, ShieldCheck, Mic } from 'lucide-react';

export const faqs = [
    // --- 1. AI VOICE ASSISTANT CATEGORY (CORE FEATURE) ---
    {
        id: 1,
        category: 'AI Voice Assistant',
        q: 'How does the MediHelp AI Voice Assistant work?',
        a: 'Our AI Voice Assistant acts similarly to Gemini or ChatGPT but is built specifically for quick medical inquiries. Its primary method is Voice Query, enabling a hands-free experience so you can speak directly to the app during an urgent situation. Text input is provided as a secondary option.',
        detailedAnswer: 'The MediHelp AI Voice Assistant is a conversational intelligence module similar to ChatGPT or Gemini, but specifically customized for healthcare and emergency response workflows. The system is architected as Voice-First: meaning, Voice Query is the primary input delivery system to allow extremely rapid, hands-free operation, particularly during critical incidents where a user cannot manually type out text logs. A standard text input interface remains fully accessible as a secondary alternative fallback configuration.',
        steps: [
            'Tap the prominent circular Microphone Icon located on your active dashboard view console.',
            'Directly state your medical inquiry or immediate emergency scenario clearly (e.g., "What is the first-aid protocol for a deep steam burn?").',
            'Review the instantaneous voice feedback response and follow the synchronized text prescription directions displayed on your screen.',
            'If you are located in a highly noisy environment, toggle the keyboard switch adjacent to the microphone to utilize the Text Query secondary mode.'
        ],
        notes: 'Operational Note: The platform utilizes state-of-the-art Speech-to-Text (STT) parsing models. For optimal prompt generation processing, speak clearly and maintain a close proximity to your device microphone data inputs.',
        tags: ['ai assistant', 'voice query', 'hands-free', 'speech recognition', 'text query', 'chatgpt', 'gemini']
    },
    {
        id: 2,
        category: 'AI Voice Assistant',
        q: 'Can the AI Assistant activate emergency triggers through voice commands?',
        a: 'Yes. Aside from answering medical questions, the Voice Assistant can process command triggers like shouting for emergency dispatches or auto-dialing contacts when validated by your secure voice print.',
        detailedAnswer: 'The conversational voice assistant is explicitly engineered to recognize critical high-stress emergency speech patterns. When the Natural Language Processing (NLP) pipeline detects calibrated distress triggers such as "Emergency SOS" or "Call an ambulance," it immediately circumvents standard navigational confirmation layers to initiate autonomous security routines.',
        steps: [
            'Access or initialize the main Voice Assistant system console interface window.',
            'Pronounce your localized emergency phrase or activation command with a clear verbal output.',
            'The engine will display a brief 3-second safety countdown cancellation window before automatically broadcasting encryption coordinates to available dispatch centers.'
        ],
        notes: 'Compliance Warning: Do not attempt to pass fraudulent or simulated emergency voice commands onto the terminal to prevent server log account blacklisting.',
        tags: ['voice command', 'emergency trigger', 'sos voice', 'automation', 'hands free dispatch']
    },
    {
        id: 3,
        category: 'AI Voice Assistant',
        q: 'What languages does the Voice Query engine support?',
        a: 'The primary language interface model natively processes English and Tagalog (Filipino) voice queries, including mixed bilingual (Taglish) inputs commonly used in medical reporting scenarios.',
        detailedAnswer: 'To guarantee maximum community accessibility across varied demographic groups, the localized speech-to-text layer handles multi-language syntax interpretation. It parses conversational medical colloquialisms and switches language models dynamically without forcing the user to manually configure locale language presets during critical situations.',
        steps: [
            'Speak comfortably in your preferred language choice (English or Tagalog).',
            'The AI voice processor will instantly map the translated intent to its centralized medical knowledge graph libraries.',
            'The resulting prescriptive diagnostic responses will be rendered back using your device standard system audio outputs.'
        ],
        notes: 'Localization Note: Additional dialect modules are continuously integrated onto cloud microservice nodes to increase diagnostic accuracy rates across provinces.',
        tags: ['language support', 'tagalog voice', 'english input', 'taglish conversion', 'nlp localization']
    },

    // --- 2. GETTING STARTED CATEGORY ---
    {
        id: 4,
        category: 'Getting Started',
        q: 'How do I update my medical profile?',
        a: 'Navigate to your personal Dashboard, click on Settings, and look for the Profile fields. From there, you can update your physical metrics, existing health conditions, and hit save to commit updates securely.',
        detailedAnswer: 'Your medical profile is the core element of the MediHelp emergency response engine. It is crucial to keep this information updated so that in the event of an unexpected situation (emergencies), the responding medical personnel can access accurate and precise healthcare data.',
        steps: [
            'Log into your MediHelp account using your secure credentials.',
            'From the left sidebar of your Main Dashboard, locate and click the "Settings" tab.',
            'Select the sub-section labeled "Medical Profile Configurations".',
            'Update your physical metrics (such as Blood Type, Allergies, Current Medical Conditions, and Emergency Contacts).',
            'Click the "Save Changes" button to process your data through cryptographic block encryption before committing save parameters.'
        ],
        notes: 'Notice: Any modifications to your medical profile require re-verifying your security PIN to guarantee that you are explicitly authorizing the layout adjustments.',
        tags: ['profile', 'configurations', 'emergency setup', 'blood type']
    },
    {
        id: 5,
        category: 'Getting Started',
        q: 'What should I do immediately after registering an account?',
        a: 'Right after registration, it is highly recommended to fill in your emergency contact matrix and download your offline recovery token passphrase.',
        detailedAnswer: 'The absolute baseline step immediately following initial profile generation is confirming that the ecosystem parameters are fully primed for crisis conditions. This includes documenting an operational safety network consisting of at least two certified proxy contacts (family members or primary physicians).',
        steps: [
            'Navigate directly inside the Account Settings panel workspace.',
            'Input the complete name, active mobile contact matrix, and relation parameters of your chosen emergency guardian.',
            'Commit the record data blocks so the automated platform nodes can distribute instantaneous cellular broadcast alerts during crisis incidents.'
        ],
        notes: 'Validation Check: Ensure all global mobile network prefix codes are formatted accurately to eliminate dispatch notification transmission delivery blockages.',
        tags: ['registration', 'setup guide', 'emergency contacts', 'first time user']
    },

    // --- 3. NEARBY HOSPITAL MAP CATEGORY ---
    {
        id: 6,
        category: 'Nearby Hospital Map',
        q: 'How does the Nearby Hospital Map work?',
        a: 'The map interface uses browser-level geolocation services to acquire your exact coordinates. It cross-references this with our verified medical registry to plot the closest emergency hubs and clinics within your vicinity.',
        detailedAnswer: 'The dynamic visual positioning maps map out your location by utilizing advanced GPS data triangulation in conjunction with verified open geospatial telemetry configurations. Once location data scopes are successfully provisioned, the database maps real-time distances to authenticated clinics.',
        steps: [
            'Select the "Nearby Hospital" tab located on your active user dashboard layout view.',
            'Approve the security browser popup authorization permission query demanding active Geolocation Device Access.',
            'Interact with the plotted visual pins to inspect localized medical facility hotline details, operating shifts, and live specialized equipment inventories.'
        ],
        notes: 'Hardware Calibration: Configure your mobile operating system to utilize High Accuracy Location Mode parameters to minimize coordinate tracking tolerances.',
        tags: ['map', 'geolocation', 'gps navigation', 'hospitals', 'clinics']
    },
    {
        id: 7,
        category: 'Nearby Hospital Map',
        q: 'Does the hospital map routing work offline?',
        a: 'Basic location indexing is retained, but active navigation recalculations and live route mapping updates require an active network data line.',
        detailedAnswer: 'The application architecture actively caches previously requested medical center coordinates into your local browser infrastructure sandbox storage layer. While direct automated path recalculation triggers cannot interact without data lines, structural addresses remain readable.',
        steps: [
            'While operating on an active internet link, view your local city radius to force automated mapping memory cache states.',
            'When disconnected from cell towers, access the mapping layout directory to view static alphanumeric street routing descriptions.'
        ],
        notes: 'Safety Precaution: It is highly advised to extract offline screen captures or printouts of primary care destination contact numbers for direct analog telephone connectivity alternative backups.',
        tags: ['offline map', 'data cache', 'offline limits', 'routing assistance']
    },

    // --- 4. PRIVACY & SECURITY CATEGORY ---
    {
        id: 8,
        category: 'Privacy & Security',
        q: 'Is my medical data secure with MediHelp?',
        a: 'Yes, data privacy is our cornerstone. MediHelp enforces end-to-end cryptographic layers on top of your medical data blocks. No third parties, or unauthenticated users can look into your healthcare files.',
        detailedAnswer: 'All highly sensitive information, particularly your historical health profiles, vitals tracking, and encryption logs, are subjected to strict military-grade cryptographic hashing pipelines before committing onto cloud clusters. Unauthorized administrators or malicious third-party vectors cannot parse your data files without direct key grants.',
        steps: [
            'Your unique cryptographic decryption keys are synthesized and isolated strictly inside your local client-side sandbox environment.',
            'Every active cross-network data sync initialization demands verification via an isolated JSON Web Token authentication layer.',
            'Session access parameters automatically terminate following short windows of system idle detection.'
        ],
        notes: 'Warning: Never share your Private Encryption Key with anyone under any circumstances. The MediHelp support team does not retain duplicate copies and it cannot be recovered if lost.',
        tags: ['security', 'privacy', 'aes-256', 'encryption keys', 'data protection']
    },

    // --- 5. GENERAL ACCOUNT CATEGORY ---
    {
        id: 9,
        category: 'Account',
        q: 'Can I use MediHelp features as a guest user?',
        a: 'Guest users can easily read through the public health platform tools and knowledge databases. However, storing dynamic health conditions, utilizing emergency response metrics, and managing encryption keys require an official registered account.',
        detailedAnswer: 'The platform architecture allows unverified guest connections to openly view educational public safety updates, interactive primary first-aid documentation modules, and general hospital inventory tables. However, critical alert delivery tools require formal account creation steps to protect system integrity.',
        steps: [
            'To access unrestricted platform capabilities, progress towards the registration layout and build a permanent profile block.',
            'Provide official validation documents onto the security module to complete your user profile verification process.',
            'Once verified, link external wearable IoT medical devices (such as smartwatches) to broadcast real-time biometric metrics onto your panel.'
        ],
        notes: 'Account Advantage: Registered profiles gain permanent execution authority over the Instant SOS Emergency Broadcast Widget which activates instantly with a single interaction.',
        tags: ['guest user', 'account registration', 'sos access', 'verification']
    }
];