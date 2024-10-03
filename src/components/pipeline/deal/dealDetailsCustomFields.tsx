import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import GenerateElements from "../../../common/generateElements";
import { Deal } from "../../../models/deal";
import Util from "../../../others/util";
import DealCustomFieldAddEdit from "./dealCustomFieldAddEdit";

type params = {
  dealItem: Deal;
  setDealItem: any;
};
const DealDetailsCustomFields = (props: params) => {
  const { dealItem, setDealItem, ...others } = props;
  const [customFields, setCustomFields] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const formOptions = {
    resolver: yupResolver(getValidationsSchema(customFields)),
  };
  const methods = useForm(formOptions);
  const { handleSubmit, unregister } = methods;

  const onChange = (value: any, item: any) => {};

  const getSelectedList=(e:any)=>{
    return [];
  }

  const onElementDelete=(index:number)=>{
    
    let controlsList = customFields;
    controlsList.splice(index, 1);
    setCustomFields([...controlsList]);
  }

  return (
    <FormProvider {...methods}>
      <div className="appdealblock-head">
        <div className="appblock-headcolleft">
          <button className="appblock-collapse">
            <span className="appblock-titlelabel">
              <FontAwesomeIcon icon={faAngleDown} /> Details
            </span>
          </button>
        </div>
      </div>
      <div hidden={customFields.length == 0}>
        {
          <GenerateElements
            controlsList={customFields}
            selectedItem={dealItem}
            onChange={(value: any, item: any) => onChange(value, item)}
            getSelectedList={(e: any) => getSelectedList(e)}
            onElementDelete={(e: any) =>onElementDelete(e)}
          />
        }
      </div>

      <div>
        <div hidden={customFields.length > 0}>
          <p>Add custom fields to include more details about the deal.</p>
        </div>

        <div className="pt-4">
          <button onClick={(e:any)=>setDialogIsOpen(true)}>+ Custom Field</button>
        </div>
      </div>

      {dialogIsOpen && (
        <DealCustomFieldAddEdit
          customFields={customFields}
          setCustomFields={setCustomFields}
          dialogIsOpen={dialogIsOpen}
          setDialogIsOpen={setDialogIsOpen}
        />
      )}
    </FormProvider>
  );
};

export default DealDetailsCustomFields;
