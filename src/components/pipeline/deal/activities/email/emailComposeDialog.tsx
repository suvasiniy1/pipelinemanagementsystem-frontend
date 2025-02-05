import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import Util from "../../../../../others/util";
import { AddEditDialog } from "../../../../../common/addEditDialog";
import { ElementType, IControl } from "../../../../../models/iControl";
import GenerateElements from "../../../../../common/generateElements";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import LocalStorageUtil from "../../../../../others/LocalStorageUtil";
import Constants from "../../../../../others/constants";
import {
  EmailItemProps,
  EmailTemplate,
} from "../../../../../models/emailTemplate";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const EmailComposeDialog = (props: any) => {
  const {
    header,
    onSave,
    closeDialog,
    selectedItem,
    setSelectedItem,
    dialogIsOpen,
    setDialogIsOpen,
    isReadOnly,
    setIsReadOnly,
    setLoadRowData,
    fromAddress,
    personEmail,
    ...others
  } = props;
  const { instance, accounts } = useMsal();

  const [attachmentFiles, setAttachmentFiles] = useState<Array<any>>([]);
  const [progress, setProgress] = useState<any>({}); // Progress for each file

  const controlsList: Array<IControl> = [
    {
      key: "To",
      value: "toAddress",
      isRequired: true,
      regex1:
        /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:\s*[,;]\s*[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/,
      errMsg1: "Please enter valid email addresses",
    },
    {
      key: "CC",
      value: "cc",
    },
    {
      key: "Bcc",
      value: "bcc",
    },
    {
      key: "From",
      value: "fromAddress",
      disabled: true,
      isRequired: true,
    },
    {
      key: "Subject",
      value: "subject",
      isRequired: true,
    },
    {
      key: "Body",
      value: "body",
      type: ElementType.ckeditor,
      isRequired: true,
      hideSpaceForEditor: true,
    },
  ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const formOptions = {
    resolver: yupResolver(getValidationsSchema(controlsList)),
  };
  const methods = useForm(formOptions);
  const { handleSubmit, unregister, register, resetField, setValue, setError } =
    methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  function addReToSubject(subject: any) {
    // Trim whitespace from the beginning and end of the subject
    subject = subject.trim();

    // Check if subject already starts with "Re:"
    if (!subject.startsWith("Re:")) {
      // If not, prepend "Re:" to the subject
      subject = `Re: ${subject}`;
    }

    return subject;
  }

  const handleReplyClick = () => {
    
    let senderName = selectedItem.sender.emailAddress.name;
    let senderEmail = selectedItem.sender.emailAddress.address;
    let sentDate = formatEmailDate(new Date(selectedItem.sentDateTime).toLocaleString());
    let message = selectedItem.bodyPreview.split("\r")[0];
    let formattedReply =`<br/><br/><div dir=\"ltr\" class=\"gmail_attr\">${sentDate} ${senderName} &lt;<a href=${senderEmail}">${senderEmail}</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex\"><div><p>${message}</p></div></blockquote></div>`;
    return formattedReply;
  };

  function formatEmailDate(dateString:any) {
    // Convert the input string to a Date object
    const date = new Date(dateString);
  
    // Format day of the week (e.g., Tue)
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  
    // Format month name (e.g., Feb)
    const month = date.toLocaleDateString("en-US", { month: "short" });
  
    // Format day, year, and time
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  
    // Construct the final formatted string
    return `On ${weekday}, ${month} ${day}, ${year} at ${time}`;
  }

  useEffect(() => {
    console.log("Received personEmail prop:", props.personEmail);
  }, [props.personEmail]);
  
  useEffect(() => {
    let toAddresses = selectedItem?.sender?.emailAddress?.address || props.personEmail || "default@example.com"; 

    console.log("Contact Person Email:", toAddresses);

    let obj = {
      ...selectedItem,
      fromAddress: fromAddress?.username, 
      toAddress: toAddresses,
      body: selectedItem?.body?.content.replace(/<body>.*?<br>/s, handleReplyClick()),
      subject: selectedItem.subject
        ? addReToSubject(selectedItem.subject)
        : null,
      isReply: !Util.isNullOrUndefinedOrEmpty(selectedItem.subject),
    };
    setSelectedItem(obj);
    controlsList.forEach((c) => {
      resetValidationsOnLoad(c.value, obj[c.value]);
    });
  }, []);

  const resetValidationsOnLoad = (key: any, value: any) => {
    setValue(key as never, value as never);
  };

  const onChange = (
    value: any,
    item: any,
    itemName?: any,
    isValidationOptional: boolean = false
  ) => {
    if (!isValidationOptional) {
      if (item.key === "Body") {
        value = value === "<p><br></p>" ? null : value;
        setSelectedItem({ ...selectedItem, body: value });
        setValue(item.value as never, value as never);
        if (value) unregister(item.value as never);
        else register(item.value as never);
        resetField(item.value as never);
      }
    }
  };

  const onSubmit = (item: any) => {
    let obj = Util.toClassObject(selectedItem, item);
    obj.toAddress = item.toAddress;
    props.onSave(obj, attachmentFiles);
  };

  const getAttachedData = () => {
    let list: Array<EmailTemplate> = JSON.parse(
      LocalStorageUtil.getItemObject(Constants.EMAIL_TEMPLATES) as any
    );

    let itemList: Array<any> = [];
    list.forEach((i) => {
      let header: EmailItemProps = JSON.parse(i.header as any);
      let body = JSON.parse(i.body as any);
      let footer = JSON.parse(i.footer as any);
      let content = `<div class="email-header" style="text-align: ${header.position}; background-color:${header.backGroundColor}">${header.content}</div>
      <br/>
      <hr>
      <div class="email-body" style="text-align: ${body.position};background-color:${body.backGroundColor}">${body.content}</div>
      <div class="email-footer" style="text-align: ${footer.position}; background-color:${footer.backGroundColor}">${footer.content}</div>`;
      let value = content;

      let obj = { name: i.name, value: value };
      itemList.push(obj);
    });

    return itemList;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map((file) => ({
      file,
      progress: 0, // Initially set the progress to 0
    }));

    // Add new files to the current files list
    setAttachmentFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Immediately start uploading the files
    selectedFiles.forEach((file) => {
      uploadFile(file); // Start uploading the file
    });
  };

  // Function to handle file upload and track progress
  const uploadFile = async (file: any) => {
    const accessToken = await getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`,
      true
    );
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

    // Progress tracking
    xhr.upload.onprogress = (event: any) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setProgress((prevProgress: any) => ({
          ...prevProgress,
          [file.name]: percentage, // Update the progress for the current file
        }));
      }
    };

    // Upload complete
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log(`${file.name} uploaded successfully`);
        // Handle success (e.g., show a message, store file URL, etc.)
      } else {
        console.error(`Upload failed for ${file.name}`);
      }
    };

    // Upload file
    xhr.send(formData);
  };

  const getAccessToken = async () => {
    try {
      // Try to acquire token silently
      const accessTokenResponse = await instance.acquireTokenSilent({
        scopes: ["Files.ReadWrite", "Mail.Send"], // Adjust scopes as needed
        account: accounts[0],
      });
      return accessTokenResponse.accessToken;
    } catch (error) {
      console.error("Silent token acquisition failed", error);

      // Handle the error if it's due to consent or token expiration
      if (error instanceof InteractionRequiredAuthError) {
        // Trigger an interactive login to acquire the token
        try {
          const accessTokenResponse = await instance.acquireTokenPopup({
            scopes: ["Files.ReadWrite", "Mail.Send"], // Adjust scopes as needed
          });
          return accessTokenResponse.accessToken;
        } catch (popupError) {
          console.error("Interactive authentication failed", popupError);
          throw popupError; // Rethrow error to handle it elsewhere in the app
        }
      } else {
        throw error; // Rethrow any other errors
      }
    }
  };

  // Handle deleting a file before upload
  const handleDelete = (fileName: string) => {
    setAttachmentFiles((prevFiles) =>
      prevFiles.filter((file) => file.file.name !== fileName)
    );
    setProgress((prevProgress: any) => {
      const { [fileName]: _, ...rest } = prevProgress;
      return rest;
    });
  };

  const previewFiles = () => {
    return attachmentFiles.map((file: any, index: any) => {
      const fileURL = URL.createObjectURL(file);
      return (
        <div key={index}>
          <img src={fileURL} alt="preview" width="100" height="100" />
          <p>{file.name}</p>
        </div>
      );
    });
  };

  const customFooter = () => {
    return (
      <>
        <div className="modalfootbar">
          <div className="pr-4" style={{ paddingRight: "15px" }}>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload-input"
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                document.getElementById("file-upload-input")?.click();
              }}
              className="file-upload-link"
            >
              <AttachFileIcon />
            </a>
          </div>
          <button
            onClick={(e: any) => setDialogIsOpen(false)}
            className="btn btn-secondary btn-sm me-2 pl-2"
            id="closeDialog"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary btn-sm me-2"
            id="closeDialog"
          >
            Send
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={"Email"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            customFooter={customFooter()}
            onClose={oncloseDialog}
          >
            <br />

            <GenerateElements
              controlsList={controlsList}
              selectedItem={selectedItem}
              onChange={(value: any, item: any) => onChange(value, item)}
              getAttachedData={(e: any) => getAttachedData()}
            />

            <div className="form-group row">
              <div className="col-5"></div>
              <div className="col-1" style={{alignItems:"center", alignContent:"center", paddingBottom:"10px"}} hidden={attachmentFiles.length==0}>Attachements:</div>
              <div className="col-6">
                {" "}
                <div style={{paddingLeft:"40px"}}>
                  {attachmentFiles.map(({ file }: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {/* Truncated File Name */}
                      <span
                        style={{
                          flex: 1,
                          fontWeight: "500",
                          color: "#333",
                          whiteSpace: "nowrap", // Prevent text wrapping
                          overflow: "hidden", // Hide overflowing text
                          textOverflow: "ellipsis", // Show ellipsis when text overflows
                          maxWidth: "200px", // Adjust the maximum width as needed
                        }}
                      >
                        {file.name}
                      </span>

                      {/* Progress Bar Container */}
                      <div
                        style={{
                          flex: 2,
                          width: "100%",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "5px",
                          height: "10px",
                          marginLeft: "15px",
                          marginRight: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress[file.name] || 0}%`,
                            height: "100%",
                            backgroundColor: "#4caf50",
                            borderRadius: "5px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(file.name)}
                      >
                        <CloseIcon/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default EmailComposeDialog;
