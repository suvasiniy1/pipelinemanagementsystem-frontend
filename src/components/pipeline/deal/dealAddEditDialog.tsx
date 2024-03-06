import { useState } from "react";
import { AddEditDialog } from "../../../common/addEditDialog"
import { IControl, ElementType, CustomActionPosition } from "../../../models/iControl";
import Util from "../../../others/util";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from "react-hook-form";
import GenerateElements from "../../../common/generateElements";
import { Deal } from "../../../models/deal";
import { Stage } from "../../../models/stage";

type params = {
    dialogIsOpen: boolean;
    setDialogIsOpen: any;
    onSaveChanges: any;
    index?: number;
}
export const DealAddEditDialog = (props: params) => {
    const { dialogIsOpen, setDialogIsOpen, onSaveChanges, index, ...others } = props;
    const stagesList: Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];
    const selectedItem = { ...new Deal(), pipeLineId: stagesList[index as any]?.stageID };
    const controlsList1 = [
        { "key": "Contact Person", "value": "personId", "isRequired": true, "isControlInNewLine": true, "dependentChildren": null },
        { "key": "Organization", "value": "organization", "isRequired": true, "isControlInNewLine": true, "dependentChildren": null },
        { "key": "Title", "value": "title", "isRequired": true, "isControlInNewLine": true, "dependentChildren": null },
        { "key": "Value", "value": "pipeLineId", "isRequired": false, "isControlInNewLine": true, "dependentChildren": "Currency Type" },
        { "key": "Currency Type", "value": "currencyType", "type": ElementType.dropdown, "isRequired": false, "isControlInNewLine": true, "isDependentChildren": true, "customAction": CustomActionPosition.Right, "actionName": "Add products" },
        { "key": "Pipeline Stage", "value": "pipeLineId", "type": ElementType.dropdown, "isRequired": true, "isControlInNewLine": true, "dependentChildren": null }
    ];

    const controlsList2 = [
        { "key": "Phone", "value": "phoneNumber", "isRequired": false, "isControlInNewLine": true, "dependentChildren": "Phone Type", "customAction": CustomActionPosition.Left, "actionName": "+ Add phone" },
        { "key": "Phone Type", "value": "phoneType", "type": ElementType.dropdown, "isRequired": false, "isControlInNewLine": true, "isDependentChildren": true },
        { "key": "Email", "value": "email", "isRequired": false, "isControlInNewLine": true, "dependentChildren": "Email Type", "customAction": CustomActionPosition.Left, "actionName": "+ Add email" },
        { "key": "Email Type", "value": "emailType", "type": ElementType.dropdown, "isRequired": false, "isControlInNewLine": true, "isDependentChildren": true },
    ];

    const validationsSchema = Yup.object().shape({
        ...Util.buildValidations(controlsList1)
    });

    const validationsSchema2 = Yup.object().shape({
        ...Util.buildValidations(controlsList2)
    });

    const formOptions = { resolver: yupResolver(validationsSchema.concat(validationsSchema2)) };
    const methods = useForm(formOptions);
    const { handleSubmit } = methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    const onChange = (value: any, item: any) => {
        if (Util.isListNullOrUndefinedOrEmpty(item.itemType)) return;
    }

    const getStages = () => {
        let list: Array<any> = [];
        // stagesList.forEach(s => {
        //     let obj = { "name": s.name, "value": s.id };
        //     list.push(obj);
        // });
        return list;
    }

    const onSubmit = (item: any) => {

        // let addUpdateItem: Deal = new Deal();
        // Util.toClassObject(addUpdateItem, item);
        // let stageItemIndex = stagesList.findIndex(i => i.id == addUpdateItem.pipeLineId);
        // stagesList[stageItemIndex].deals.push(addUpdateItem);
        // localStorage.setItem("stagesList", JSON.stringify(stagesList));

        props.onSaveChanges();
        setDialogIsOpen(false);
    }
    return (
        <>
            <FormProvider {...methods}>
                <AddEditDialog dialogIsOpen={dialogIsOpen}
                    header={"Add Deal"}
                    closeDialog={oncloseDialog}
                    onClose={oncloseDialog}
                    onSave={handleSubmit(onSubmit)}>
                    {
                        <>
                            <div className='modelformfiledrow row'>
                                <div className='modelformleft col-6 pt-3 pb-3'>
                                    <div className='modelformbox ps-2 pe-2'>
                                        <GenerateElements
                                            controlsList={controlsList1}
                                            selectedItem={selectedItem}
                                            onChange={(value: any, item: any) => onChange(value, item)}
                                            getListofItemsForDropdown={(e: any) => getStages()}
                                        />

                                        <div className="form-group row pt-2">
                                            <label htmlFor="name" id={`labelFor`} className={`col-sm-6`}>Pipeline Stage:</label>
                                            <div className="col-sm-6 pipelinestage-selector pipelinestage-active">
                                                <label className="pipelinestage pipelinestage-current" aria-label="New Lead"></label>
                                                <label className="pipelinestage" aria-label="1st Call"></label>
                                                <label className="pipelinestage" aria-label="2nd Call"></label>
                                                <label className="pipelinestage" aria-label="3rd Call"></label>
                                                <label className="pipelinestage" aria-label="4th Call"></label>
                                                <label className="pipelinestage" aria-label="Final Call"></label>
                                                <label className="pipelinestage" aria-label="Appointment Booked"></label>
                                                <label className="pipelinestage" aria-label="CLOSED LEADS"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='modelformright col-6 pt-3 pb-3'>
                                    <div className='modelformbox ps-2 pe-2'>
                                        <div className='personname'>Person</div>
                                        <GenerateElements
                                            controlsList={controlsList2}
                                            selectedItem={selectedItem}
                                            onChange={(value: any, item: any) => onChange(value, item)}
                                            getListofItemsForDropdown={(e: any) => getStages()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>



                    }
                </AddEditDialog>
            </FormProvider>
        </>
    )
}