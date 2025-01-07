import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useFormContext } from "react-hook-form";

type Params = {
  item?: any;
  onItemChange?: (selectedItems: string) => void;
  list: Array<any>;
  selectedList: Array<any>;
  isValidationOptional?: boolean;
  selectedItem?: any;
  disable?: any;
};

const MultiSelectDropdownWithValidations = (props: Params) => {
  
  const { item, onItemChange, list, selectedList } = props;
  const { register, formState: { errors } } = useFormContext();

  const [options, setOptions] = useState([{ name: "Select All", value: "all" }, ...list]);
  const [selectedValues, setSelectedValues] = useState(selectedList);

  // Update options when list changes
  useEffect(() => {
    setOptions([{ name: "Select All", value: "all" }, ...list]);
  }, [list]);

  useEffect(() => {
    setSelectedValues(props.selectedList);
  }, [props.selectedList]);

  useEffect(() => {
    // Hide "Select All" chip using JavaScript
    setTimeout(() => {
      document.querySelectorAll(".chip").forEach((chip:any) => {
        if (chip?.textContent?.trim() === "Select All") {
          chip.style.display = "none"; // Hide the chip
        }
      });
    }, 100); // Delay to ensure DOM is updated
  }, [selectedValues]);

  // Handle selection logic
  const onSelect = (selected: any) => {
    const isSelectAllClicked = selected.some((item: any) => item.value === "all");

    if (isSelectAllClicked) {
      if (selectedValues.length === list.length) {
        // If all items were already selected, clear selection
        setSelectedValues([]);
        onItemChange?.("");
      } else {
        // Select all options including "Select All"
        setSelectedValues([{ name: "Select All", value: "all" }, ...list]);
        onItemChange?.(list.map((x) => x[item?.bindable ?? "name"]).join(","));
      }
    } else {
      // Normal selection
      const allSelected = selected.length === list.length;
      setSelectedValues(allSelected ? [{ name: "Select All", value: "all" }, ...selected] : selected);
      onItemChange?.(selected.filter((i:any)=>i.value!="all").map((x: any) => x[item?.bindable ?? "name"]).join(","));
    }
  };

  // Handle removal logic
  const onRemove = (selected: any, selectedItem:any) => {

    let selectedList:Array<any> = selected;
    if(selectedItem.value==="all"){
      selectedList = [];
    }
    setSelectedValues(selectedList.filter(i=>i.value!="all"));
    onItemChange?.(selectedList.map((x: any) => x[item?.bindable ?? "name"]).join(","));
  };

  return (
    <>
      <Multiselect
        showCheckbox
        options={options}
        selectedValues={selectedValues}
        onSelect={onSelect}
        onRemove={onRemove}
        displayValue="name"
        {...register(item?.value)}
      />
      <p className="text-danger" id={`validationMsgfor_${item?.value}`}>
        {(errors as any)?.[item?.value]?.message}
      </p>
    </>
  );
};

const MultiSelectDropdown = (props: Params) => {
  return <MultiSelectDropdownWithValidations {...props} />;
};

export default MultiSelectDropdown;
