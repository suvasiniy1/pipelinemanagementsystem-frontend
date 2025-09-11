import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { EmailTemplate } from "../models/emailTemplate";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./pipeline/deal/activities/email/authConfig";
import { sendEmail } from "./pipeline/deal/activities/email/emailService";
import { prepareEmailBody } from "./pipeline/deal/activities/email/emailActivites";
import { toast } from "react-toastify";
import { EmailCompose } from "../models/emailCompose";

type GroupEmailDialogProps = {
  open: boolean;
  onClose:any;
  selectedRecipients: string[];
  selectedTemplate: EmailTemplate | null;
  templates: EmailTemplate[];
  onTemplateSelect: (template: EmailTemplate) => void;
};

const GroupEmailDialog: React.FC<GroupEmailDialogProps> = ({
  open,
  onClose,
  selectedRecipients,
  selectedTemplate,
  templates,
  onTemplateSelect,
}) => {
  const [templateId, setTemplateId] = useState<string>("");
  const [header, setHeader]     = useState<string>("");
  const { instance, accounts } = useMsal();
  const [body, setBody]         = useState<string>("");
  const [footer, setFooter]     = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");
  const [subject, setSubject]   = useState<string>("");
  const [fromAddress, setFromAddress] = useState<string>(
    accounts[0]?.username || "Testtest@transforminglives.co.uk"
  );

  useEffect(()=>{
    clearFields();
    // Set from address to current user's email if available
    if (accounts[0]?.username) {
      setFromAddress(accounts[0].username);
    }
  },[accounts])

  useEffect(() => {
  if (open) {
    // new open → start clean unless a template is already provided
    if (!selectedTemplate) clearFields();
    // refresh "From"
    if (accounts[0]?.username) setFromAddress(accounts[0].username);
  }
}, [open, accounts]);

  const clearFields = () => {
    setTemplateId("");
    setHeader(""); 
    setBody("");
    setFooter("");
    setEmailContent("");
    setSubject("");
  };

  // Utility function to safely extract content from EmailItemProps
  const getContent = (itemProps: any): string => {
    try {
      if (typeof itemProps === "object" && itemProps.content) {
        return itemProps.content;
      } else if (typeof itemProps === "string") {
        const parsedProps = JSON.parse(itemProps);
        return parsedProps?.content || "";
      }
      return "";
    } catch (error) {
      console.error("Error extracting content:", error);
      return "";
    }
  };

  // Function to update content fields
  const updateContentFields = (template: EmailTemplate | null) => {
    if (template) {
      let headerContent = "",
        bodyContent = "",
        footerContent = "";

      try {
        // Extracting content directly from the JSON structure
        headerContent = getContent(template.header);
        bodyContent = getContent(template.body);
        footerContent = getContent(template.footer);
      } catch (error) {
        console.error("Error parsing template content:", error);
      }

      // Setting extracted values to state
      setHeader(headerContent || "");
      setBody(bodyContent || "");
      setFooter(footerContent || "");
    }
  };

  // Update email content whenever header, body, or footer changes
  useEffect(() => {
    const combinedContent =
  `${(header ?? "").trim()}<br/><br/>` +
  `${(body ?? "").trim()}<br/><br/>` +
  `${(footer ?? "").trim()}`;
    setEmailContent(combinedContent);
  }, [header, body, footer]);

  // Update form fields when selectedTemplate changes
  useEffect(() => {
  if (selectedTemplate) {
    setTemplateId(String(selectedTemplate.id)); // ← convert to string
    const headerContent = getContent(selectedTemplate.header);
    const bodyContent   = getContent(selectedTemplate.body);
    const footerContent = getContent(selectedTemplate.footer);
    setHeader(headerContent);
    setBody(bodyContent);
    setFooter(footerContent);
    setSubject("");
  }else {
    // deselected → wipe current fields
    clearFields();
  }
}, [selectedTemplate]);
useEffect(() => {
  // only if you actually want a reset on recipients change
  // setSubject("");
}, [selectedRecipients.join(";")]);  // join → stable dep

  // Handle template change in dropdown
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    setTemplateId(selectedId);
    const template = templates.find((t) => String(t.id) === selectedId);
    if (template) {
      onTemplateSelect(template);
      updateContentFields(template);
      setSubject(""); // Reset subject when a new template is selected
    }
  };

  // Handle the send email action
  const handleSendEmail = async () => {
    
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    
    if (!fromAddress.trim()) {
      toast.error("Please enter a from address");
      return;
    }
    
    if (selectedRecipients.length === 0) {
      toast.error("Please select recipients");
      return;
    }

    var emailObj = new EmailCompose();
    emailObj.subject = subject;
    emailObj.fromAddress = fromAddress; // Set the from address
    
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    emailObj.toAddress = selectedRecipients
      .filter((email) => email && isValidEmail(email.trim()))
      .join(";");
      
    emailObj.body = `<div class="email-header">${header || ''}</div>
    <hr>
    <br/>
    <div class="email-body">${body || ''}</div>
        <br/>
    <hr>
    <div class="email-footer">${footer || ''}</div>`;

    console.log("Sending Email Data:", emailObj);
    continueToSend(emailObj);
  };

  const continueToSend = async (emailObj: any) => {
    try {
      let accessTokenResponse;
      
      try {
        // Try silent token acquisition first
        accessTokenResponse = await instance.acquireTokenSilent({
          scopes: ["Mail.Send"],
          account: accounts[0],
        });
      } catch (silentError) {
        console.log("Silent token acquisition failed, trying interactive login", silentError);
        
        // If silent acquisition fails, try interactive login
        try {
          accessTokenResponse = await instance.acquireTokenPopup({
            scopes: ["Mail.Send"],
            account: accounts[0],
          });
        } catch (interactiveError) {
          console.error("Interactive token acquisition failed", interactiveError);
          toast.error("Authentication failed. Please try logging in again.");
          return;
        }
      }

      // Send email logic here
      const emailBody = await prepareEmailBody(emailObj);

      let response: any = await sendEmail(
        accessTokenResponse.accessToken,
        emailBody
      );

      if (!response.error) {
        clearFields();
        onClose();
        toast.success("Email sent successfully");
      } else {
        toast.error("Unable to send email please verify");
      }
    } catch (error) {
      console.error("Email sending failed", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Send Group Email</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row">
          {/* Recipients Section */}
          <Box flex={1} mr={2} style={{ maxWidth: "30%" }}>
            <Typography variant="h6">Recipients</Typography>
            <div style={{ height: "800px" }}>
              <div
                style={{
                  height: "100%",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "8px",
                }}
              >
                {selectedRecipients.map((recipient, index) => (
                  <div key={index} style={{ marginBottom: "4px" }}>
                    {recipient}
                  </div>
                ))}
              </div>
            </div>
          </Box>

          {/* Email Content Section */}
          <Box flex={2}>
            <TextField
              label="From"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Select Template"
              value={templateId}
              onChange={handleTemplateChange}
              fullWidth
              margin="normal"
            >
              {/* Render the templates in the dropdown */}
              {templates.map((template) => (
                <MenuItem key={template.id} value={String(template.id)}>
                  {template.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Subject Field */}
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              margin="normal"
            />

            {/* Individual Header, Body, and Footer Fields using ReactQuill */}
            <Typography variant="h6" gutterBottom>
              Header
            </Typography>
            <ReactQuill key={`hdr-${templateId}-${open ? 1 : 0}`} value={header || ""} onChange={setHeader} />

            <Typography variant="h6" gutterBottom>
              Body
            </Typography>
            <ReactQuill key={`body-${templateId}-${open ? 1 : 0}`} value={body || ""} onChange={setBody} />

            <Typography variant="h6" gutterBottom>
              Footer
            </Typography>
            <ReactQuill key={`ftr-${templateId}-${open ? 1 : 0}`} value={footer || ""} onChange={setFooter} />

            {/* Email Content Display TextArea */}
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Combined Email Content (Read-Only):
            </Typography>
            <div
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                minHeight: "200px",
                overflow: "auto",
                whiteSpace: "normal",
              }}
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSendEmail} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupEmailDialog;
