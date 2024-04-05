import React, { useState } from "react";
import Picker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormContext } from "react-hook-form";

type params = {
    item: any;
    selectedItem: any;
    onChange?: any;
    value?: any;
    disable?: boolean;
}
export const DATEPICKER = (props: params) => {
    
    const { item, selectedItem, value, onChange, disable, ...others } = props;
    const [startDate, setStartDate] = useState<Date>(new Date());

    const { register, formState: { errors } } = useFormContext();
    
    return (
        <>
        <Picker
            placeholderText="MM/DD/YYYY"
            showIcon
            selected={selectedItem[item.value]}
            className="form-control"
            {...register(item.value)}
            onChange={(date) => onChange(date as any)}
        />
        <p className="text-danger" id={`validationMsgfor_${item.value}`}>{(errors as any)?.[item.value]?.message}</p>
        </>
    );
};