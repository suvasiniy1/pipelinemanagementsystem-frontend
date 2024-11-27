import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Box, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { EmailTemplate } from '../models/emailTemplate';

type GroupEmailDialogProps = {
  open: boolean;
  onClose: () => void;
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
  const [templateId, setTemplateId] = useState<number | string>('');
  const [header, setHeader] = useState<string>(''); 
  const [body, setBody] = useState<string>(''); 
  const [footer, setFooter] = useState<string>(''); 
  const [emailContent, setEmailContent] = useState<string>(''); 
  const [subject, setSubject] = useState<string>(''); 
  const [fromAddress, setFromAddress] = useState<string>('Testtest@transforminglives.co.uk'); 

  // Utility function to safely extract content from EmailItemProps
  const getContent = (itemProps: any): string => {
    try {
      if (typeof itemProps === 'object' && itemProps.content) {
        return itemProps.content;
      } else if (typeof itemProps === 'string') {
        const parsedProps = JSON.parse(itemProps);
        return parsedProps?.content || '';
      }
      return '';
    } catch (error) {
      console.error("Error extracting content:", error);
      return '';
    }
  };

  // Function to update content fields
  const updateContentFields = (template: EmailTemplate | null) => {
    if (template) {
      let headerContent = '', bodyContent = '', footerContent = '';

      try {
        // Extracting content directly from the JSON structure
        headerContent = getContent(template.header);
        bodyContent = getContent(template.body);
        footerContent = getContent(template.footer);
      } catch (error) {
        console.error("Error parsing template content:", error);
      }

      // Setting extracted values to state
      setHeader(headerContent || '');
      setBody(bodyContent || '');
      setFooter(footerContent || '');
    }
  };

  // Update email content whenever header, body, or footer changes
  useEffect(() => {
    const combinedContent = `${header.trim()}<br/><br/>${body.trim()}<br/><br/>${footer.trim()}`;
    setEmailContent(combinedContent);
  }, [header, body, footer]);

  // Update form fields when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateId(selectedTemplate.id);
      const headerContent = getContent(selectedTemplate.header);
      const bodyContent = getContent(selectedTemplate.body);
      const footerContent = getContent(selectedTemplate.footer);

      setHeader(headerContent);
      setBody(bodyContent);
      setFooter(footerContent);
      setSubject(''); // Ensure subject is editable separately
    }
  }, [selectedTemplate]);

  // Handle template change in dropdown
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    setTemplateId(selectedId);
    const template = templates.find((t) => t.id === Number(selectedId));
    if (template) {
      onTemplateSelect(template);
      updateContentFields(template);
      setSubject(''); // Reset subject when a new template is selected
    }
  };

  // Handle the send email action
  const handleSendEmail = () => {
    const emailData = {
      from: fromAddress,
      to: selectedRecipients,
      subject: subject,
      content: {
        header: header,
        body: body,
        footer: footer,
      },
    };

    console.log('Sending Email Data:', emailData);
    // Simulate sending the email data
    // You can replace the below code with your API call logic
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Send Group Email</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row">
          {/* Recipients Section */}
          <Box flex={1} mr={2} style={{ maxWidth: "30%" }}>
            <Typography variant="h6">Recipients</Typography>
            <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px' }}>
              {selectedRecipients.map((recipient, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {recipient}
                </div>
              ))}
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
                <MenuItem key={template.id} value={template.id}>
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
            <Typography variant="h6" gutterBottom>Header</Typography>
            <ReactQuill value={header} onChange={setHeader} />

            <Typography variant="h6" gutterBottom>Body</Typography>
            <ReactQuill value={body} onChange={setBody} />

            <Typography variant="h6" gutterBottom>Footer</Typography>
            <ReactQuill value={footer} onChange={setFooter} />

            {/* Email Content Display TextArea */}
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Combined Email Content (Read-Only):
            </Typography>
            <div
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                minHeight: '200px',
                overflow: 'auto',
                whiteSpace: 'normal'
              }}
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSendEmail} color="primary">Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupEmailDialog;
