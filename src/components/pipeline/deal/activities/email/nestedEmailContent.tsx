import React, { useEffect, useRef } from "react";

type params = {
  body: any;
};
const NestedEmailContent = (props: params) => {
  const { body, ...others } = props;
  const divRef = useRef();

  useEffect(() => {
    if (divRef) {
      (divRef.current as any).innerHTML = body;
    }
  }, [props]);

  return (
    <div className="email-content">
      <span
        style={{
          fontFamily: "sans-serif",
          fontSize: "14.6667px",
          lineHeight: "17.60004px",
          color: "#444444",
        }}
      >
        <div ref={divRef as any}></div>
      </span>
      <br />
    </div>
  );
};

export default NestedEmailContent;
