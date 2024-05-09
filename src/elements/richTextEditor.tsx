import React from "react";
import { CKEditor } from "ckeditor4-react";
import { useFormContext } from "react-hook-form";
import TextBox from "./TextBox";

type params = {
  onChange: any;
  value: any;
  hideSpace?: boolean;
  item?: any;
  selectedItem?: any;
  isValidationOptional?: boolean;
};

const RitechTextEditorWithValidation = (props: params) => {
  const {
    onChange,
    value,
    hideSpace,
    item,
    selectedItem,
    isValidationOptional,
    ...others
  } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <br hidden={hideSpace} />
      <CKEditor
        onChange={(e: any) => onChange(e.editor.getData())}
        initData={value}
      />
      <input type="text" {...register(item.value)} style={{display:'none'}}/>
      <p className="text-danger" id={`validationMsgfor_${item.value}`}>{(errors as any)?.[item.value]?.message}</p>
    </>
  );
};

const RichTextEditor = (props: params) => {
  const { onChange, value, hideSpace, isValidationOptional, ...others } = props;
  return (
    <>
      {isValidationOptional ? (
        <>
          <br hidden={hideSpace} />
          <CKEditor
            onChange={(e: any) => onChange(e.editor.getData())}
            initData={value}
          />
        </>
      ) : (
        <RitechTextEditorWithValidation {...props} />
      )}
    </>
  );
};

export default RichTextEditor;
