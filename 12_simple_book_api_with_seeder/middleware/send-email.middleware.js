const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");

/**
 * Email middleware for sending book creation notifications
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {number} year - Book publication year
 * @param {string} userEmail - User's email address
 * @returns {Promise} - Promise that resolves when email is sent successfully
 */
const sendBookCreationEmail = async (title, author, year, userEmail) => {
  try {
    // Validate input parameters
    if (!title || !author || !year || !userEmail) {
      throw new Error("Missing required parameters for email notification");
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // TLS configuration for production
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("Email transporter verified successfully");

    // Compile Pug template to HTML
    const templatePath = path.join(__dirname, "..", "views", "bookCreated.pug");
    const htmlContent = pug.renderFile(templatePath, {
      title,
      author,
      year,
      userEmail,
      currentYear: new Date().getFullYear(),
    });

    // Email options
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: userEmail,
      subject: `New Book Added: ${title}`,
      html: htmlContent,
      // Fallback text version
      text: `
Hello,

A new book has been successfully added to your library system.

Book Details:
- Title: ${title}
- Author: ${author}
- Year: ${year}

This is an automated notification from your Book Management System.

Best regards,
Book Management Team
            `.trim(),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      to: userEmail,
      subject: mailOptions.subject,
    });

    // Log email provider specific information
    if (process.env.SMTP_HOST === "smtp.gmail.com") {
      console.log("📧 Email sent via Gmail! Check your inbox at:", userEmail);
    } else if (
      process.env.NODE_ENV === "development" &&
      nodemailer.getTestMessageUrl(info)
    ) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId,
      message: "Email notification sent successfully",
    };
  } catch (error) {
    console.error("Email sending failed:", {
      error: error.message,
      stack: error.stack,
      userEmail,
      bookTitle: title,
    });

    // Don't throw the error - we don't want email failures to break book creation
    return {
      success: false,
      error: error.message,
      message: "Failed to send email notification",
    };
  }
};

module.exports = {
  sendBookCreationEmail,
};
