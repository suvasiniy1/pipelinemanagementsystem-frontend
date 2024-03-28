import { useEffect, useState } from "react";
import { AddEditDialog } from "../../../common/addEditDialog"
import { IControl, ElementType, CustomActionPosition } from "../../../models/iControl";
import Util from "../../../others/util";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from "react-hook-form";
import GenerateElements from "../../../common/generateElements";
import { Deal } from "../../../models/deal";
import { Stage } from "../../../models/stage";
import { PipeLine } from "../../../models/pipeline";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { DealService } from "../../../services/dealService";
import { ToastContainer, toast } from 'react-toastify';
import { StageService } from "../../../services/stageService";

type params = {
    dialogIsOpen: boolean;
    setDialogIsOpen: any;
    onSaveChanges: any;
    index?: number;
    pipeLinesList:Array<PipeLine>
}
export const DealAddEditDialog = (props: params) => {
    const { dialogIsOpen, setDialogIsOpen, onSaveChanges, index, pipeLinesList, ...others } = props;
    const [stages, setStages] = useState<Array<Stage>>([]);
    const [selectedItem, setSelectedItem] = useState({ ...new Deal()});
    const [isLoading, setIsLoading]=useState(false);
    const dealsSvc = new DealService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);

    const controlsList1 = [
        { "key": "Contact Person", "value": "personName", "isRequired": true, "isControlInNewLine": true, "dependentChildren": null },
        { "key": "Organization", "value": "organization", "isRequired": true, "isControlInNewLine": true, "dependentChildren": null },
        { "key": "Title", "value": "title", "isRequired": true, "isControlInNewLine": true, "dependentChildren": null },
        { "key": "Value", "value": "value", "isRequired": true, "isControlInNewLine": true, "dependentChildren": "Currency Type" },
        { "key": "Currency Type", "value": "currencyType", "type": ElementType.dropdown, "isRequired": false, "isControlInNewLine": true, "isDependentChildren": true, "customAction": CustomActionPosition.Right, "actionName": "Add products" },
        { "key": "Pipeline", "value": "pipelineID", "type": ElementType.dropdown, "isRequired": true, "isControlInNewLine": true, "dependentChildren": null }
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
    const { handleSubmit} = methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    useEffect(() => {
        let defaultPipeLine = pipeLinesList[0]?.pipelineID;
        setSelectedItem({...selectedItem, "pipelineID":+defaultPipeLine});
        loadStages(defaultPipeLine);
    }, [])

    const loadStages=(selectedPipeLineId:number)=>{
        setIsLoading(true);
        if(selectedPipeLineId>0) stagesSvc.getStages(selectedPipeLineId).then(items => {
            setStages(items.stageDtos);
            setSelectedItem({...selectedItem, "pipelineID":+selectedPipeLineId, "stageID":items.stageDtos[0]?.stageID});
            setIsLoading(false);
        }).catch(err=>{
        });
    }

    const onChange = (value: any, item: any) => {
        if (item.key==="Pipeline") {
            setSelectedItem({...selectedItem, "pipelineID":+value});
            setStages([])
            loadStages(+value);
        }
    }

    const getPipeLines = () => {
        let list: Array<any> = [];
        pipeLinesList.forEach(s => {
            let obj = { "name": s.pipelineName, "value": s.pipelineID };
            list.push(obj);
        });
        return list;
    }

    const onSubmit = (item: any) => {
        
        let addUpdateItem: Deal = new Deal();
        addUpdateItem.createdBy = Util.UserProfile()?.user;
        addUpdateItem.modifiedBy = Util.UserProfile()?.userId;
        addUpdateItem.createdDate = new Date();
        Util.toClassObject(addUpdateItem, item);
        addUpdateItem.pipelineID = +selectedItem.pipelineID;
        addUpdateItem.stageID = selectedItem.stageID;
        console.log("addUpdateItem" + {...addUpdateItem});

       dealsSvc.postItemBySubURL(addUpdateItem, "saveDealDetails").then(res=>{
        if(res.dealID>0){
            toast.success("Deal added successfully");
            setTimeout(() => {
                setDialogIsOpen(false);
                props.onSaveChanges();
            }, 500);
        }
        else{
            toast.error("Unable to add Deal");
        }

       })

    }
    return (
        <>
            {
                selectedItem.pipelineID ?
                    <FormProvider {...methods}>
                        <AddEditDialog dialogIsOpen={dialogIsOpen}
                            header={"Add Deal"}
                            closeDialog={oncloseDialog}
                            onClose={oncloseDialog}
                            onSave={handleSubmit(onSubmit)}
                            disabled={isLoading}>
                            {
                                <>
                                    {isLoading && <div className="alignCenter"><Spinner /></div>}
                                    <div className='modelformfiledrow row'>
                                        <div className='modelformleft col-6 pt-3 pb-3'>
                                            <div className='modelformbox ps-2 pe-2'>
                                                <GenerateElements
                                                    controlsList={controlsList1}
                                                    selectedItem={selectedItem}
                                                    onChange={(value: any, item: any) => onChange(value, item)}
                                                    getListofItemsForDropdown={(e: any) => getPipeLines()}
                                                />

                                                <div className="form-group row pt-2">
                                                    <label htmlFor="name" id={`labelFor`} className={`col-sm-6`}>Pipeline Stage:</label>
                                                    <div className="col-sm-6 pipelinestage-selector pipelinestage-active" aria-disabled={isLoading}>
                                                        {
                                                            stages.map((sItem, sIndex) => (
                                                                <label className="pipelinestage pipelinestage-current" aria-label={sItem.stageName} title={sItem.stageName} onClick={(e: any) => setSelectedItem({ ...selectedItem, "stageID": sItem.stageID })}></label>
                                                            ))
                                                        }
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
                                                    getListofItemsForDropdown={(e: any) => getPipeLines()}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </>



                            }
                        </AddEditDialog>
                    </FormProvider>
                    : null
            }
        </>
    )
}