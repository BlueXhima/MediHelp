const transporter = require('../config/mailer');

exports.sendSecurityAlert = async (req, res) => {
    const { Email, Device, Time } = req.body;
    
    // Check if email exists before sending (Optional but recommended)
    const mailOptions = {
        from: `"MediHelp Security" <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'Security Alert: Login Attempts',
        html: `
            <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; padding: 60px 20px; color: #374151; line-height: 1.5;">
                <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #f3f4f6;">
                    
                    <!-- Brand Header - Minimalist Reused -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="display: inline-block; width: 64px; height: 64px; background-color: #fef2f2; border-radius: 16px; margin-bottom: 12px; padding: 12px; box-sizing: border-box;">
                            <!-- Base64 Shield Alert Icon para sa Security -->
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMjJzOC00IDgtMTBWNWwtOC0zLTggM3Y3YzAgNiA4IDEwIDggMTB6Ii8+PHBhdGggZD0iTTEyIDh2NG0wIDRoLjAxIi8+PC9zdmc+" 
                                alt="Security Alert" 
                                style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">MediHelp</h2>
                    </div>

                    <!-- Message Body -->
                    <div style="text-align: left; margin-bottom: 32px;">
                        <p style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px;">Security Notification,</p>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">
                            We detected multiple failed login attempts on your account. For your protection, we've temporarily restricted access.
                        </p>
                    </div>

                    <!-- Incident Details Box -->
                    <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Incident Details</span>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>Time:</b> ${Time}</p>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>Device:</b> ${Device}</p>
                    </div>

                    <!-- Action Button -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">If this wasn't you, please secure your account immediately:</p>
                        <a href="http://localhost:5173/forgot-password" 
                            style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; transition: all 0.2s;">
                            Secure My Account
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: center;">
                        <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                            © 2026 MediHelp Philippines
                        </p>
                        <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">Imus, Cavite</p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Alert sent" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Failed to send email alert" });
    }
};