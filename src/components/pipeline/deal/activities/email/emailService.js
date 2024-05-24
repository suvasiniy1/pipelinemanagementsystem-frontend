import { Client } from '@microsoft/microsoft-graph-client';

export const sendEmail = async (accessToken) => {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  try {
    const response = await client
      .api('/me/sendMail')
      .post({
        message: {
          subject: 'Hello from Outlook OAuth!',
          body: {
            contentType: 'Text',
            content: 'This is a test email sent using Outlook OAuth.',
          },
          toRecipients: [
            {
              emailAddress: {
                address: 'recipient@example.com',
              },
            },
          ],
        },
      });

    console.log('Email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
