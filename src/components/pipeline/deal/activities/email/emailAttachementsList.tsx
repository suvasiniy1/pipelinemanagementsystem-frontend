import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";

type params = {
  attachments: Array<any>;
};

// Function to decode base64 content
const base64ToBlob = (base64: any, contentType: any) => {
  const binaryString = atob(base64); // Decode the base64 string
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
};

// Component to display attachments
const EmailAttachments = (props: params) => {
  
  const { attachments, ...others } = props;
  const [attachmentUrls, setAttachmentUrls] = useState<Array<any>>([]);

  useEffect(() => {
    const generateAttachmentUrls = () => {
      const urls = attachments.map((attachment) => {
        const { contentBytes, contentType, name } = attachment;
        const blob = base64ToBlob(contentBytes, contentType);
        const objectUrl = URL.createObjectURL(blob);
        return { name, contentType, objectUrl };
      });
      setAttachmentUrls(urls);
    };

    if (attachments && attachments.length > 0) {
      generateAttachmentUrls();
    }

    // Clean up object URLs when component is unmounted
    return () => {
      attachmentUrls.forEach((attachment) => {
        URL.revokeObjectURL(attachment.objectUrl);
      });
    };
  }, [attachments]);

  return (
    <div>
      {attachmentUrls.length > 0 ? (
        <div>
          <br/>
          <h3>
            {attachmentUrls.length === 1
              ? "One attachment"
              : attachmentUrls.length > 1
              ? `${attachmentUrls.length} attachments`
              : "No attachments"} :
          </h3>
          <ul>
            {attachmentUrls.map((attachment, index) => (
              <li key={index}>
                <div>
                  {attachment.contentType === "application/pdf" ? (
                    <object
                      data={attachment.objectUrl}
                      type="application/pdf"
                      width="150"
                      height="150"
                    >
                      <p>
                        Your browser does not support embedded PDFs. You can
                        download it{" "}
                        <a href={attachment.objectUrl} download>
                          here
                        </a>
                        .
                      </p>
                    </object>
                  ) : attachment.contentType.startsWith("image") ? (
                    <img
                      src={attachment.objectUrl}
                      alt={attachment.name}
                      width="150"
                      height="150"
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {" "}
                  <a href={attachment.objectUrl} download className="pt-4">
                    <DownloadIcon />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No attachments available.</p>
      )}
    </div>
  );
};

export default EmailAttachments;
