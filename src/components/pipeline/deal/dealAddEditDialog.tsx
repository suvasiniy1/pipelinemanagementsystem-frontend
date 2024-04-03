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
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import { Utility } from "../../../models/utility";

type params = {
    dialogIsOpen: boolean;
    setDialogIsOpen: any;
    onSaveChanges: any;
    index?: number;
    pipeLinesList: Array<PipeLine>
    selectedPipeLineId:number;
}
export const DealAddEditDialog = (props: params) => {
    const { dialogIsOpen, setDialogIsOpen, onSaveChanges, index, pipeLinesList, selectedPipeLineId, ...others } = props;
    const [stages, setStages] = useState<Array<Stage>>([]);
    const [selectedItem, setSelectedItem] = useState({ ...new Deal() });
    const [isLoading, setIsLoading] = useState(false);
    const dealsSvc = new DealService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);
    const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
    const [persons, setPersons] = useState(utility?.persons ?? []);

    const controlsList1: Array<IControl> = [
        { key: "Deal Name", value: "title", sidebyItem: "Company", isRequired: true },
        { key: "Company", value: "organizationID", type: ElementType.dropdown, isSideByItem: true, isRequired: true },
    ];

    const controlsList2: Array<IControl> = [
        { key: "Category", value: "category", sidebyItem: "Probability Of Winning", isRequired: true },
        { key: "Probability Of Winning", value: "probability", isSideByItem: true, isRequired: true },
        { key: "Forecast Close Date", value: "operationDate", sidebyItem: "Actual Close Date", type:ElementType.datepicker, isRequired: true },
        { key: "Actual Close Date", value: "expectedCloseDate", isSideByItem: true, type:ElementType.datepicker, isRequired: true },
        { key: "User Responsible", value: "contactPersonID", sidebyItem: "Deal Value", type:ElementType.dropdown, isRequired: true },
        { key: "Deal Value", value: "value", isRequired: true, isSideByItem: true }
    ];

    const controlsList3: Array<IControl> = [
        { key: "Description", value: "description", isControlInNewLine:true, elementSize:12, type: ElementType.textarea, isRequired: false },
    ]

    const controlsList4: Array<IControl> = [
        { key: "Tag List", value: "tags", isControlInNewLine:true, elementSize:12,type: ElementType.dropdown, isRequired: false },
    ]

    const controlsList5: Array<IControl> = [
        { key: "Pipeline", value: "pipelineID", type: ElementType.dropdown, sidebyItem: "Stage", disabled:true },
        { key: "Stage", value: "stageID", type: ElementType.custom, isSideByItem: true },
    ]

    const controlsList = [controlsList1, controlsList2, controlsList3, controlsList4, controlsList5];

    

    const getValidationsSchema = (list: Array<any>) => {
        return Yup.object().shape({
            ...Util.buildValidations(list)
        });
    }

    const formOptions = {
        resolver: yupResolver(getValidationsSchema(controlsList[0])
            // .concat(getValidationsSchema(controlsList[1]))
            // .concat(getValidationsSchema(controlsList[2]))
            // .concat(getValidationsSchema(controlsList[3]))
            // .concat(getValidationsSchema(controlsList[4]))
        )
    };

    const methods = useForm(formOptions);
    const { handleSubmit } = methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    useEffect(() => {
        let defaultPipeLine = selectedPipeLineId ?? pipeLinesList[0]?.pipelineID;
        setSelectedItem({ ...selectedItem, "pipelineID": +defaultPipeLine });
        loadStages(defaultPipeLine);
    }, [])

    const loadStages = (selectedPipeLineId: number) => {
        setIsLoading(true);
        if (selectedPipeLineId > 0) stagesSvc.getStages(selectedPipeLineId).then(items => {
            setStages(items.stageDtos);
            setSelectedItem({ ...selectedItem, "pipelineID": +selectedPipeLineId, "stageID": items.stageDtos[0]?.stageID });
            setIsLoading(false);
        }).catch(err => {
        });
    }

    const onChange = (value: any, item: any) => {
        if (item.key === "Pipeline") {
            setSelectedItem({ ...selectedItem, "pipelineID": +value });
            setStages([])
            loadStages(+value);
        }
        if(item.key ==="Forecast Close Date"){
            setSelectedItem({...selectedItem, operationDate:value})
        }
        if(item.key ==="Actual Close Date"){
            setSelectedItem({...selectedItem, expectedCloseDate:value})
        }
    }

    const getPipeLines = () => {
        let list: Array<any> = [];
        pipeLinesList.forEach(s => {
            let obj = { "name": s.pipelineName, value: s.pipelineID };
            list.push(obj);
        });
        return list;
    }

    const getJsxForStage = () => {
        return (
            <div className="col-sm-6 pipelinestage-selector pipelinestage-active" aria-disabled={isLoading}>
                {
                    stages.map((sItem, sIndex) => (
                        <label className="pipelinestage pipelinestage-current" aria-label={sItem.stageName} title={sItem.stageName} onClick={(e: any) => setSelectedItem({ ...selectedItem, "stageID": sItem.stageID })}></label>
                    ))
                }
            </div>
        )
    }

    const onSubmit = (item: any) => {
        
        let addUpdateItem: Deal = new Deal();
        addUpdateItem.createdBy = Util.UserProfile()?.userId;
        addUpdateItem.modifiedBy = Util.UserProfile()?.userId;
        addUpdateItem.createdDate = new Date();
        Util.toClassObject(addUpdateItem, item);
        addUpdateItem.pipelineID = +selectedItem.pipelineID;
        addUpdateItem.stageID = selectedItem.stageID;
        console.log("addUpdateItem" + { ...addUpdateItem });
        
        dealsSvc.postItemBySubURL(addUpdateItem, "saveDealDetails").then(res => {
            if (res.dealID > 0) {
                toast.success("Deal added successfully");
                setTimeout(() => {
                    setDialogIsOpen(false);
                    props.onSaveChanges();
                }, 500);
            }
            else {
                toast.error("Unable to add Deal");
            }

        })

    }

    const getCustomElement=(item:IControl)=>{
        if(item.key==="Stage") return getJsxForStage();
    }

    const getDropdownvalues=(item:any)=>{
        if(item.key ==="Pipeline"){
            return getPipeLines() ?? [];
        }
        if(item.key ==="Company"){
            
            return utility?.organizations.map(({ name, organizationID }) => ({"name":name, "value":organizationID})) ?? [];
        }
        if(item.key ==="User Responsible"){
            return utility?.persons.map(({ personName, personID }) => ({"name":personName, "value":personID})) ?? [];
        }
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
                                        <div>
                                            <div className='modelformbox ps-2 pe-2'>
                                                {
                                                    controlsList.map((c, cIndex) => (
                                                        <GenerateElements
                                                            controlsList={c}
                                                            selectedItem={selectedItem}
                                                            onChange={(value: any, item: any) => onChange(value, item)}
                                                            getListofItemsForDropdown={(e: any) => getDropdownvalues(e) as any}
                                                            getCustomElement={(item:IControl)=>getCustomElement(item)}
                                                        />
                                                    ))
                                                }
                                                                                                        <br/>
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