const express = require('express');
const router = express.Router();
const sendEmailViaGoogle  = require('../config/mailer');

router.post('/contact', async (req, res) => {
    const { fullName, email, subject, message } = req.body;

    // 1. Validation (Optional but recommended)
    if (!fullName || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // 2. HTML Template for the email body
        const htmlBody = `
            <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; padding: 60px 20px; color: #374151; line-height: 1.5;">
                <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #f3f4f6;">
                    
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="display: inline-block; width: 64px; height: 64px; background-color: #f5f3ff; border-radius: 16px; margin-bottom: 12px; padding: 12px; box-sizing: border-box;">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3YzNlZGVyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTggMTV2MWE2IDYgMCAwIDAgNiA2djBhNiA2IDAgMCAwIDYtNnYtNCI+PC9wYXRoPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjIiPjwvY2lyY2xlPjwvc3ZnPg==" 
                                alt="Support" 
                                style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">MediHelp Support</h2>
                    </div>

                    <div style="text-align: left; margin-bottom: 32px;">
                        <p style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px;">New Support Inquiry,</p>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">
                            You have received a new message from the contact form. Details of the inquiry are provided below.
                        </p>
                    </div>

                    <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Contact Information</span>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>From:</b> ${fullName}</p>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>Email:</b> ${email}</p>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>Subject:</b> ${subject}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                        
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Message</span>
                        <p style="margin: 0; font-size: 14px; color: #1f2937; white-space: pre-line; line-height: 1.6;">${message}</p>
                    </div>

                    <div style="text-align: center; margin-bottom: 32px;">
                        <a href="mailto:${email}" 
                            style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px;">
                            Reply to Message
                        </a>
                    </div>

                    <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: center;">
                        <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                            © 2026 MediHelp Philippines
                        </p>
                        <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">Imus, Cavite</p>
                    </div>
                </div>
            </div>
        `;

        // 3. Ipinadala ang email sa inyong team email gamit ang Google Script API Bridge
        const teamEmail = "medihelp241@gmail.com";
        await sendEmailViaGoogle(
            teamEmail,
            `[MediHelp Contact Form] ${subject}`,
            htmlBody
        );
        
        return res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Google Script Contact Form Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
    }
});

module.exports = router;
