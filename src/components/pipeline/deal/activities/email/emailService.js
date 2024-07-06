import { Client } from "@microsoft/microsoft-graph-client";

export const sendEmail = async (accessToken, body) => {
  // Example function to send email using access token
  try {
    // Replace with your actual email sending logic
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: body,
      }
    );
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// emailService.js

export const getSentEmails = async (accessToken) => {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }
    const data = await response.json();
    return data.value; // Assuming messages are returned in the 'value' property
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    throw error;
  }
};

