import React, { useState } from "react";
import Picker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    return (
        <Picker
            placeholderText="MM/DD/YYYY"
            showIcon
            selected={selectedItem[item.value]}
            className="form-control"
            onChange={(date) => onChange(date as any)}
        />
    );
};