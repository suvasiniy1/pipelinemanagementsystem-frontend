import React from 'react'
import { CKEditor } from 'ckeditor4-react';

type params = {
    onChange: any;
    value: any;
}
const RichTextEditor = (props: params) => {
    const { onChange, value, ...others } = props;
    return (
        <CKEditor onChange={(e: any) => onChange(e.editor.getData())}
            onLoaded={(e: any) => {
                
                e.editor.setData(value);
            }} />
    )
}

export default RichTextEditor