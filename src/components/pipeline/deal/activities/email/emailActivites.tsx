import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { deleteEmail, getSentEmails, sendEmail } from "./emailService"; // Assuming you have a function to fetch sent emails
import { Spinner } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import SentEmailsList from "./sentEmailsList";
import EmailComposeDialog from "./emailComposeDialog";
import { EmailCompose } from "../../../../../models/emailCompose";
import { toast } from "react-toastify";
import { DeleteDialog } from "../../../../../common/deleteDialog";

function EmailActivities() {
  const { instance, accounts } = useMsal();
  const [emailSent, setEmailSent] = useState(false);
  const [emailsList, setEmailsList] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && instance) {
      fetchData();
    }
  }, [(instance as any)?.controller?.initialized, accounts]);

  const fetchData = async () => {
    if ((instance as any)?.controller?.initialized) {
      try {
        setIsLoading(true);
        const accessTokenResponse = await instance.acquireTokenSilent({
          scopes: ["Mail.Read"], // Adjust scopes as per your requirements
          account: accounts[0],
        });
        // Fetch sent emails after acquiring token
        const emails = await getSentEmails(accessTokenResponse.accessToken);
        
        setEmailsList(emails);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching emails:", error);
        setIsLoading(false);
      }
    }
  };

  const handleLogin = async () => {
    try {
      let res = await instance.loginPopup(loginRequest);
      console.log("Login successful", res);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSendEmail = async (emailObj: any) => {
    try {
      const accessTokenResponse = await instance.acquireTokenSilent({
        scopes: ["Mail.Send"],
        account: accounts[0],
      });
      // Send email logic here
      await sendEmail(
        accessTokenResponse.accessToken,
        prepareEmailBody(emailObj),
        emailObj.isReply ? selectedEmail.id : null
      );
      setEmailSent(true);
      setDialogIsOpen(false);
      toast.success("Email sent successfully");
      fetchData();
    } catch (error) {
      console.error("Email sending failed", error);
      setDialogIsOpen(false);
      toast.success("Unable to sent email please re try after sometime");
    }
  };

  const handleDeleteEmail= async () => {
    try {
      const accessTokenResponse = await instance.acquireTokenSilent({
        scopes: ["Mail.Send",'mail.read', 'mail.readwrite'],
        account: accounts[0],
      });
      // Send email logic here
      await deleteEmail(
        accessTokenResponse.accessToken,
        selectedEmail.id
      );
      setShowDeleteDialog(false)
      toast.success("Email deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Email deleting failed", error);
      setDialogIsOpen(false);
      toast.success("Unable to delete email please re try after sometime");
    }
  };

  const prepareEmailBody = (emailObj: EmailCompose) => {
    return JSON.stringify({
      message: {
        subject: emailObj.subject,
        body: {
          contentType: "HTML",
          content: emailObj.body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: emailObj.toAddress,
            },
          },
        ]
        // ccRecipients: [
        //   {
        //     emailAddress: {
        //       address: emailObj.cc,
        //     },
        //   },
        // ],
        // bccRecipients: [
        //   {
        //     emailAddress: {
        //       address: emailObj.bcc,
        //     },
        //   },
        // ]
      },
    });
  };

  return (
    <div>
      <>
        <div className="activityfilter-row pb-3">
          {isLoading ? (
            <div className="alignCenter">
              <Spinner />
            </div>
          ) : (
            <div className="createnote-row">
              {accounts.length === 0 ? (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="btn btn-primary"
                >
                  Login
                </button>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={(e: any) => {
                      setSelectedEmail(new EmailCompose());
                      setDialogIsOpen(true);
                    }}
                    className="btn btn-primary"
                  >
                    Send Email
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div hidden={accounts.length === 0 || isLoading}>
          <h3>April 2024</h3>
          <div
            className="activityfilter-accrow  mb-3"
            hidden={emailsList.length == 0}
          >
            <Accordion className="activityfilter-acco">
              {emailsList.map((email, index) => (
                <SentEmailsList
                  email={email}
                  index={index}
                  setShowDeleteDialog={setShowDeleteDialog}
                  setDialogIsOpen={setDialogIsOpen}
                  selectedIndex={selectedIndex}
                  setSelectedEmail={setSelectedEmail}
                  setSelectedIndex={(e: any) => {
                    setSelectedIndex(e);
                  }}
                  emailsList={emailsList.filter(i=>i.conversationId==email.conversationId)}
                />
              ))}
            </Accordion>
          </div>
          <div
            style={{ textAlign: "center" }}
            hidden={emailsList.length > 0 || accounts.length === 0}
          >
            No emails are available to show
          </div>
        </div>
      </>
      {dialogIsOpen && (
        <EmailComposeDialog
          fromAddress={accounts[0]}
          dialogIsOpen={dialogIsOpen}
          onCloseDialog={(e: any) => setSelectedEmail(null as any)}
          selectedItem={selectedEmail ?? new EmailCompose()}
          setSelectedItem={setSelectedEmail}
          setDialogIsOpen={setDialogIsOpen}
          onSave={(e: any) => {
            handleSendEmail(e);
          }}
        />
      )}
      {showDeleteDialog && (
        <DeleteDialog
          itemType={"Email"}
          itemName={""}
          dialogIsOpen={showDeleteDialog}
          closeDialog={(e: any) => setShowDeleteDialog(false)}
          onConfirm={(e: any) =>{handleDeleteEmail()}}
          isPromptOnly={false}
          actionType={"Delete"}
        />
      )}
    </div>
  );
}

export default EmailActivities;
