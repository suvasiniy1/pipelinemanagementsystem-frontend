import { useFormContext } from "react-hook-form";

type props = {
    item: any;
    selectedItem: any;
    onItemChange?: any;
    list: Array<any>;
    disable?:boolean;
}
const SelectDropdown: React.FC<props> = (props) => {
    console.log("Selectdropdown component rendered with props "+ props);

    
    const { item, selectedItem, onItemChange, list, disable, ...others } = props;

    const { register, formState: { errors } } = useFormContext();
    
    return (

            <>
                <select className="form-control"
                    id={item.value}
                    key={"region"}
                    disabled={disable ?? item.disabled}
                    defaultValue={selectedItem[item.value]}
                    {...register(item.value)}
                    onChange={(e: any) => onItemChange(e.target.value)}
                >
                    <option value="">Select</option>
                    {list?.map((item: any, index: number) => {
                        return (
                            <option key={index} value={item.value}>{item.name}</option>
                        );
                    }
                    )}
                </select>
                <p className="text-danger" id={`validationMsgfor_${item.value}`}>{(errors as any)?.[item.value]?.message}</p>
            </>    
    )
}

export default SelectDropdown;