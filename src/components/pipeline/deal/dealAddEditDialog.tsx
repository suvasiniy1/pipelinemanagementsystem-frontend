import { useState } from "react";
import { AddEditDialog } from "../../../common/addEditDialog"
import { IControl, ElementType } from "../../../models/iControl";
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
    onSaveChanges:any
}
export const DealAddEditDialog = (props: params) => {
    const { dialogIsOpen, setDialogIsOpen, onSaveChanges, ...others } = props;
    const selectedItem = new Deal();
    const stagesList: Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];

    const [controlsList, setControlsList] = useState<Array<IControl>>([
        { "key": "Contact Person", "value": "personId", "isRequired": true, "isControlInNewLine": true },
        { "key": "Organization", "value": "organization", "isRequired": true, "isControlInNewLine": true },
        { "key": "Title", "value": "title", "isRequired": true, "isControlInNewLine": true },
        { "key": "Pipeline Stage", "value": "pipeLineId", "type": ElementType.dropdown, "isRequired": true, "isControlInNewLine": true },
    ]);

    const validationsSchema = Yup.object().shape({
        ...Util.buildValidations(controlsList)
    });

    const validationsSchema2 = Yup.object().shape({
        password: Yup.string()
            .min(12, 'Password must be atleast 12 chars')
            .max(64, 'Password can be max 64 chars')
            .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{12,}$/, 'Password must be atleast 12 characters and at least 1 numeric, 1 lowercase, 1 uppercase and 1 special characters'),
    });

    const formOptions = { resolver: yupResolver(validationsSchema.concat(validationsSchema2)) };
    const methods = useForm(formOptions);
    const { handleSubmit, getValues, setValue } = methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    const onChange = (value: any, item: any) => {
        if (Util.isListNullOrUndefinedOrEmpty(item.itemType)) return;
        let obj = { ...selectedItem };
    }

    const getStages = () => {
        let list: Array<any> = [];
        stagesList.forEach(s => {
            let obj = { "name": s.name, "value": s.id };
            list.push(obj);
        });
        return list;
    }

    const onSubmit = (item: any) => {
        
        let addUpdateItem: Deal = new Deal();
        Util.toClassObject(addUpdateItem, item);
        let stageItemIndex = stagesList.findIndex(i=>i.id==addUpdateItem.pipeLineId);
        stagesList[stageItemIndex].deals.push(addUpdateItem);
        localStorage.setItem("stagesList", JSON.stringify(stagesList));
        
        props.onSaveChanges();
        setDialogIsOpen(false);
    }
    return (
        <>
            <FormProvider {...methods}>
                <AddEditDialog  dialogIsOpen={dialogIsOpen}
                                header={"Add Deal"}
                                closeDialog={oncloseDialog}
                                onClose={oncloseDialog}
                                onSave={handleSubmit(onSubmit)}>
                    {
                        <GenerateElements
                            controlsList={controlsList}
                            selectedItem={selectedItem}
                            onChange={(value: any, item: any) => onChange(value, item)}
                            getListofItemsForDropdown={(e: any) => getStages()}
                        />
                    }
                </AddEditDialog>
            </FormProvider>
        </>
    )
}