import { useFormContext } from "react-hook-form";

type params = {
    item?: any;
    selectedItem?: any;
    onItemChange?: any;
    list: Array<any>;
    disable?: boolean;
    isValidationOptional?: boolean;
    value?:any
    hideSelect?:boolean;
}

export const SelectDropdownWithValidation = (props: params) => {
    const { item, selectedItem, onItemChange, list, disable, isValidationOptional, value, hideSelect, ...others } = props;
    const { register, formState: { errors } } = useFormContext();

    return (
        <>
            <select className="form-control"
                id={item.value}
                disabled={disable ?? item.disabled}
                value={value ?? selectedItem[item.value]}
                {...register(item.value)}
                onChange={(e: any) => onItemChange(e.target.value)}
            >
                <option value="" hidden={hideSelect}>Select</option>
                {list?.map((item: any, index: number) => {
                    return (
                        <option key={index} value={item.key}>{item.value}</option>
                    );
                })}
            </select>
            <p className="text-danger" id={`validationMsgfor_${item.value}`}>{(errors as any)?.[item.value]?.message}</p>
        </>
    );
}

const SelectDropdown = (props: params) => {
    console.log("Selectdropdown component rendered with props ", props);

    const { item, selectedItem, onItemChange, list = [], disable, isValidationOptional, value, hideSelect, ...others } = props;

    return (
        <>
            {
                isValidationOptional ?
                <select
                className="form-control"
                id={item.value}
                key={"region"}
                value={value ?? selectedItem[item.value]}
                disabled={disable ?? item.disabled}
                onChange={(e: any) => onItemChange(e.target.value)}
            >
                <option value="" hidden={hideSelect}>Select</option>
                {list.map((item: any, index: number) => (
                    <option key={index} value={item.key}>{item.value}</option>
                ))}
            </select>
                    :
                    <>
                        <SelectDropdownWithValidation {...props} />
                    </>
            }
        </>
    )
}

export default SelectDropdown;