import React from "react";
import { useFormContext } from "react-hook-form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
      <ReactQuill onChange={(e:any)=>props.onChange(e)} value={value} />
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
  const { onChange, value, hideSpace, isValidationOptional, ...others } = props;
  return (
    <>
      {isValidationOptional ? (
        <>
          <br hidden={hideSpace} />
          <ReactQuill onChange={(e:any)=>props.onChange(e)} value={value} />
        </>
      ) : (
        <RitechTextEditorWithValidation {...props} />
      )}
    </>
  );
};

export default RichTextEditor;
