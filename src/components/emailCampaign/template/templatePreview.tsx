import React, { useEffect, useRef, useState } from "react";
import { EmailTemplate } from "../../../models/emailTemplate";

type params = {
  selectedItem: EmailTemplate;
  setHieghtWidth: boolean;
};
const TemplatePreview = (props: params) => {
  const { setHieghtWidth, ...others } = props;

  const headerRef = useRef();
  const bodyRef = useRef();
  const footerRef = useRef();
  const [selectedItem, setSelectedItem] = useState<EmailTemplate>(
    props.selectedItem
  );

  useEffect(() => {
    setSelectedItem(props.selectedItem);
  }, [props]);

  useEffect(() => {
    (headerRef.current as any).innerHTML =
      selectedItem.header.content ?? "Your Sample Header";
    (bodyRef.current as any).innerHTML =
      selectedItem.body.content ?? "Your Sample Body";
    (footerRef.current as any).innerHTML =
      selectedItem.footer.content ?? "Your Sample Footer";
  }, [selectedItem]);

  return (
    <div
      className="sampleemailpreview preview-pane"
      style={{
        width: setHieghtWidth ? "200px" : "",
        height: setHieghtWidth ? "200px" : "",
      }}
    >
      {/* Preview */}
      <div className="email-preview">
        <div
          className="email-header"
          style={{ textAlign: selectedItem?.header?.position, backgroundColor: selectedItem?.header?.backGroundColor}}
          ref={headerRef as any}
        ></div>
        <div
          className="email-body"
          style={{ textAlign: selectedItem?.body?.position, backgroundColor: selectedItem?.body?.backGroundColor }}
          ref={bodyRef as any}
        >
          Body
        </div>
        <div
          className="email-footer"
          style={{ textAlign: selectedItem?.footer?.position, backgroundColor: selectedItem?.footer?.backGroundColor }}
          ref={footerRef as any}
        >
          footer
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
