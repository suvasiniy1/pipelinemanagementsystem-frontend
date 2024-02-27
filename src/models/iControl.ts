export interface IControl {
    key: string;
    value: string;
    type?: ElementType;
    itemType?:string;
    isRequired?: boolean;
    hidden?: boolean | false;
    disabled?: boolean | false;
    placeHolder?: string;
    bind?: string;
    regex1?: any;
    errMsg1?: string;
    regex2?: any;
    errMsg2?: string;
    regex3?: any;
    errMsg3?: string;
    min?: number | null;
    max?: number | null;
    isControlInNewLine?:boolean | false;
    elementSize?:number;
    isFocus?:boolean;
    tabIndex?:number
}

export enum ElementType {
    "textbox"="textbox",
    "textarea"="textarea",
    "dropdown"="dropdown",
    "slider"="slider",
    "password"="password",
    "number"="number"
}