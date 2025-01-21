import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type params = {
  onChange: any;
  value: any;
  hideSpace?: boolean;
  item?: any;
  selectedItem?: any;
  isValidationOptional?: boolean;
  attachedData?: Array<any>;
};

const RitechTextEditorWithValidation = (props: params) => {
  
  const {
    value,
    onChange,
    hideSpace,
    item,
    selectedItem,
    isValidationOptional,
    attachedData,
    ...others
  } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill>(null); // Reference for Quill editor
  const [cursorPosition, setCursorPosition] = useState<number | null>(null); // Store cursor position

  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Remove event listener when component unmounts or dropdown closes
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Store cursor position before opening dropdown
  const handleAtClick = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        setCursorPosition(range.index); // Save cursor position
      }
    }
  };
 // Function to insert text at stored cursor position
  const insertTextAtCursor = (text: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      setTimeout(() => {
        quill.setText('');  // Clear the editor content first
        quill.clipboard.dangerouslyPasteHTML(0, text); // Insert new content from start
        quill.setSelection({ index: text.length, length: 0 }); 
        setShowDropdown(false); // Close dropdown after inserting
      }, 0);
    }
  };
  
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': [] }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }], // Allow background colors
      [{ 'bold': true }, { 'italic': true }, { 'underline': true }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['image'],
      [{ 'indent': '-1' }, { 'indent': '+1' }]
    ]
  };


  return (
    <>
      <br hidden={hideSpace} />
      <ReactQuill
        ref={quillRef}
        modules={modules}
        onFocus={(e: any) => handleAtClick()}
        onChange={(e: any) => props.onChange(e)}
        value={value}
      />

      <div
        hidden={!attachedData || attachedData?.length == 0}
        style={{
          cursor: "pointer",
          fontSize: "20px",
          marginTop: "10px",
          display: "inline-block",
        }}
        onClick={(e: any) => setShowDropdown(true)}
      >
      <b>Select From Template</b>  @
      </div>

      {/* Dropdown - Show when @ is clicked */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            marginTop: "5px",
            width: "150px",
            zIndex: 10,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <option disabled>Select From Template</option>
          {attachedData?.map((option, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={(e) => {
                insertTextAtCursor(option.value); // Append selected option to editor
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        {...register(item.value)}
        style={{ display: "none" }}
      />
      <p className="text-danger" id={`validationMsgfor_${item.value}`}>
        {(errors as any)?.[item.value]?.message}
      </p>
    </>
  );
};

const RichTextEditor = (props: params) => {
  
  const {
    onChange,
    value,
    hideSpace,
    isValidationOptional,
    attachedData,
    ...others
  } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill>(null); // Reference for Quill editor
  const [cursorPosition, setCursorPosition] = useState<number | null>(null); // Store cursor position

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Remove event listener when component unmounts or dropdown closes
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Store cursor position before opening dropdown
  const handleAtClick = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        setCursorPosition(range.index); // Save cursor position
      }
    }
  };

  // Function to insert text at stored cursor position
  const insertTextAtCursor = (text: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill && cursorPosition !== null) {
      const currentContent = quill.getText(); // Get current content
      const updatedContent =
        currentContent.slice(0, cursorPosition) +
        text +
        " " +
        currentContent.slice(cursorPosition);

      quill.clipboard.dangerouslyPasteHTML(cursorPosition, text);
      quill.setSelection((cursorPosition + text?.length + 1) as any); // Move cursor after inserted text
      setCursorPosition(null); // Reset stored position
    }
    setShowDropdown(false); // Close dropdown
  };

  return (
    <>
      {isValidationOptional ? (
        <>
          <br hidden={hideSpace} />
          <ReactQuill
            ref={quillRef}
            onFocus={(e: any) => handleAtClick()}
            onChange={(e: any) => props.onChange(e)}
            value={value}
          />
          <br hidden={hideSpace} />
          <div
            hidden={!attachedData || attachedData?.length == 0}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              marginTop: "10px",
              display: "inline-block",
            }}
            onClick={(e: any) => setShowDropdown(true)}
          >
           <b>Select From Template</b>  @
          </div>

          {/* Dropdown - Show when @ is clicked */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                background: "white",
                border: "1px solid #ccc",
                marginTop: "5px",
                width: "150px",
                zIndex: 10,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <option disabled>Select From Template</option>
              {attachedData?.map((option, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onClick={(e) => {
                    insertTextAtCursor(option.value); // Append selected option to editor
                  }}
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <RitechTextEditorWithValidation {...props} />
      )}
    </>
  );
};

export default RichTextEditor;
