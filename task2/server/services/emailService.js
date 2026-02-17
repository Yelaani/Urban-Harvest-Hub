import nodemailer from 'nodemailer';

/**
 * Send booking confirmation email
 * @param {string} to - Recipient email
 * @param {string} userName - Name of the user
 * @param {Array} items - List of items in the cart
 * @param {number} total - Total price
 */
export const sendConfirmationEmail = async (to, userName, items, total) => {
    try {
        // Create a test account if you don't have SMTP details
        // For production, replace this with real SMTP settings
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'urban.harvest.hub@ethereal.email', // Replace with real credentials
                pass: 'ethereal_pass_123'
            }
        });

        // If you're using this in a real app, you'd use something like Mailtrap or Gmail
        // This is a "simulation" that logs the email content clearly
        console.log(`--- [EMAIL SERVICE] ---`);
        console.log(`Sending confirmation to: ${to}`);
        console.log(`User: ${userName}`);
        console.log(`Total: $${total.toFixed(2)}`);
        console.log(`-----------------------`);

        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: '"Urban Harvest Hub" <no-reply@urbanharvest.com>',
            to: to,
            subject: 'Order Confirmation - Urban Harvest Hub',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2F855A; margin-bottom: 10px;">Urban Harvest Hub</h1>
                        <p style="color: #4A5568; font-size: 1.1rem;">Thank you for your purchase, ${userName}!</p>
                    </div>
                    
                    <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h2 style="font-size: 1.2rem; color: #2D3748; margin-top: 0;">Order Summary</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; color: #718096; font-size: 0.85rem;">
                                    <th style="padding: 10px; border-bottom: 2px solid #E2E8F0;">Item</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #E2E8F0; text-align: center;">Qty</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #E2E8F0; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="padding: 20px 10px 10px; text-align: right; font-weight: bold; color: #4A5568;">Total</td>
                                    <td style="padding: 20px 10px 10px; text-align: right; font-weight: bold; color: #2F855A; font-size: 1.25rem;">$${total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div style="color: #718096; font-size: 0.9rem; text-align: center; margin-top: 40px; border-top: 1px solid #E2E8F0; pt: 20px;">
                        <p>We're excited to have you as part of our sustainable gardening community!</p>
                        <p>&copy; 2026 Urban Harvest Hub. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        // For this demo/assignment, we "simulate" the send success
        // but the code is ready for real credentials
        return { success: true, info: 'Email mock sent successfully' };

        // Real code would be:
        // const info = await transporter.sendMail(mailOptions);
        // return info;
    } catch (error) {
        console.error('Email failed to send:', error);
        throw error;
    }
};
