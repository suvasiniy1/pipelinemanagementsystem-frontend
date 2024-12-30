import Multiselect from "multiselect-react-dropdown";
import { EmailConfiguration } from "../models/emailConfiguration";
import { useFormContext } from "react-hook-form";

type params = {
  item?: any;
  selectedItem?: any;
  onItemChange?: any;
  list: Array<any>;
  selectedList:Array<any>;
  disable?: boolean;
  isValidationOptional?: boolean;
  value?: any;
  hideSelect?: boolean;
};

const MultiSelectDropdownWithValidations = (props: params) => {
  const {
    item,
    selectedItem,
    onItemChange,
    list,
    disable,
    isValidationOptional,
    value,
    hideSelect,
    selectedList,
    ...others
  } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const onSelect = (selectedList: any, selectedItem: any) => {
    
    props.onItemChange(Array.from(selectedList, (x:any)=>x[item.bindable ?? "name"]).join(","))
  };
  const onRemove = (selectedList: any, removedItem: any) => {
    props.onItemChange(Array.from(selectedList, (x:any)=>x[item.bindable ?? "name"]).join(","))
  };

  return (
    <>
      <Multiselect
        showCheckbox={true}
        options={list} // Options to display in the dropdown
        selectedValues={selectedList} // Preselected value to persist in dropdown
        onSelect={onSelect} // Function will trigger on select event
        onRemove={onRemove} // Function will trigger on remove event
        {...register(item.value)}
        displayValue={item.displayName ?? "name"} // Property name to display in the dropdown options
      />
      <p className="text-danger" id={`validationMsgfor_${item.value}`}>
        {(errors as any)?.[item.value]?.message}
      </p>
    </>
  );
};

const MultiSelectDropdown = (props: params) => {
  const {
    item,
    selectedItem,
    onItemChange,
    list,
    disable,
    isValidationOptional,
    value,
    hideSelect,
    ...others
  } = props;

  const onSelect = (selectedList: any, selectedItem: any) => {
    return selectedList;
  };
  const onRemove = (selectedList: any, removedItem: any) => {};

  return (
    <>
      {isValidationOptional ? (
        <Multiselect
          options={list} // Options to display in the dropdown
          selectedValues={onItemChange} // Preselected value to persist in dropdown
          onSelect={onselect as any} // Function will trigger on select event
          onRemove={onRemove} // Function will trigger on remove event
          displayValue={item.displayName ?? "name"} // Property name to display in the dropdown options
        />
      ) : (
        <>
          <MultiSelectDropdownWithValidations {...props} />
        </>
      )}
    </>
  );
};

export default MultiSelectDropdown;
