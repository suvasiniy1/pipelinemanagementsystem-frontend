import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { Deal } from "../../../models/deal";
import { ElementType, IControl } from "../../../models/iControl";
import { PipeLine } from "../../../models/pipeline";
import { Stage } from "../../../models/stage";
import { Utility } from "../../../models/utility";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import Util from "../../../others/util";
import { DealService } from "../../../services/dealService";
import { StageService } from "../../../services/stageService";
import { PipeLineTypeService } from "../../../services/pipeLineTypeService";

type params = {
    dialogIsOpen: boolean;
    setDialogIsOpen: any;
    onSaveChanges: any;
    index?: number;
    pipeLinesList: Array<PipeLine>
    selectedPipeLineId?: number;
    selectedStageId?:any;
}
export const DealAddEditDialog = (props: params) => {
    
    const { dialogIsOpen, setDialogIsOpen, onSaveChanges, index, pipeLinesList, selectedPipeLineId, selectedStageId, ...others } = props;
    const [stages, setStages] = useState<Array<Stage>>([]);
    const [pipelineTypes, setPipelineTypes] = useState<Array<{ name: string, value: number }>>([]);
    const [selectedItem, setSelectedItem] = useState({ ...new Deal(), pipelineID: selectedPipeLineId ?? pipeLinesList[0].pipelineID });
    const [isLoading, setIsLoading] = useState(false);
    const dealsSvc = new DealService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);
    const pipeLineTypeSvc = new PipeLineTypeService(ErrorBoundary);
    const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
    const [persons, setPersons] = useState(utility?.persons ?? []);

    const controlsList1: Array<IControl> = [
        { key: "Contact Person", value: "contactPersonID", sidebyItem: "Deal Value", type: ElementType.dropdown, isRequired: true },
        { key: "Deal Value", value: "value", type: ElementType.textbox, isSideByItem: true, isRequired: true },
        { key: "Organization", value: "organizationID", sidebyItem: "Probability Of Winning", type: ElementType.dropdown, isRequired: true },
        { key: "Probability Of Winning", value: "probability", type: ElementType.textbox, isSideByItem: true, isRequired: true },
        { key: "Title", value: "title", sidebyItem: "Forecast Close Date", type: ElementType.textbox, isRequired: true },
        { key: "Forecast Close Date", value: "operationDate", type: ElementType.datepicker, isSideByItem: true, isRequired: false },
    ];
    
    const controlsList2: Array<IControl> = [
        { key: "Pipeline", value: "pipelineID", type: ElementType.dropdown, isRequired: true, sidebyItem: "Actual Close Date" },
        { key: "Actual Close Date", value: "expectedCloseDate", type: ElementType.datepicker, isSideByItem: true, isRequired: false },
        { key: "Stage", value: "stageID", type: ElementType.custom, isRequired: true, sidebyItem: "PA Name", disabled: !Util.isNullOrUndefinedOrEmpty(selectedStageId) }, // Stage beside PA Name
        { key: "PA Name", value: "paName", type: ElementType.textbox, isSideByItem: true, isRequired: false }, 
        { key: "Pipeline Type", value: "pipelineTypeID", type: ElementType.dropdown, isRequired: false, sidebyItem: "Lead Source" }, 
        { key: "Lead Source", value: "leadSourceID", type: ElementType.dropdown, isSideByItem: true, isRequired: true }, 
        { key: "Clinic", value: "clinicID", type: ElementType.dropdown, isRequired: true, sidebyItem: "Phone" }, 
        { key: "Phone", value: "phone", type: ElementType.textbox, isSideByItem: true, isRequired: false }, 
        { key: "Treatment", value: "treatmentID", type: ElementType.dropdown, isRequired: true, sidebyItem: "Email" }, 
        { key: "Email", value: "email", type: ElementType.textbox, isSideByItem: true, isRequired: false }, 
    ];
    const controlsList = [controlsList1, controlsList2];



    const getValidationsSchema = (list: Array<any>) => {
        return Yup.object().shape({
            ...Util.buildValidations(list)
        });
    }

    const formOptions = {
        resolver: yupResolver(getValidationsSchema(controlsList[0])
        )
    };

    const methods = useForm(formOptions);
    const { handleSubmit, resetField, setValue, setError } = methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    useEffect(() => {
        setIsLoading(true);
        let defaultPipeLine = selectedPipeLineId ?? pipeLinesList[0]?.pipelineID;
        setSelectedItem({ ...selectedItem, "pipelineID": +defaultPipeLine });
        loadStages(defaultPipeLine);
        loadPipelineTypes();
    }, [])

    const loadStages = (selectedPipeLineId: number) => {
        if (selectedPipeLineId > 0) stagesSvc.getStages(selectedPipeLineId).then(items => {
            let sortedStages = Util.sortList(items.stageDtos, "stageOrder");
            setStages(sortedStages);
            setSelectedItem({ ...selectedItem, "pipelineID": +selectedPipeLineId, "stageID": selectedStageId ?? items.stageDtos[0]?.stageID });
            setIsLoading(false);
        }).catch(err => {
        });
    }
    const loadPipelineTypes = () => {
        pipeLineTypeSvc.getPipelineTypes().then(res => {
            const pipelineTypeList = (res as Array<{ pipelineTypeName: string, pipelineTypeID: number }>).map(type => ({
                name: type.pipelineTypeName,
                value: type.pipelineTypeID,
            }));
            setPipelineTypes(pipelineTypeList);
            setIsLoading(false);
        }).catch(err => {
            toast.error("Failed to fetch pipeline types.");
            setIsLoading(false);
        });
    };
    const onChange = (value: any, item: any) => {
        if (item.key === "Pipeline") {
            setSelectedItem({ ...selectedItem, "pipelineID": +value > 0 ? +value : null as any });
            setStages([])
            if (+value > 0) loadStages(+value);
        }
        if (item.key === "Forecast Close Date") {
            setSelectedItem({ ...selectedItem, "operationDate": value });
        }
        if (item.key === "Actual Close Date") {
            setSelectedItem({ ...selectedItem, "expectedCloseDate": value })
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
                        <div key={sIndex} className={'pipelinestage ' + (sItem.stageID == selectedItem.stageID ? 'pipelinestage-current' : '')} aria-label={sItem.stageName} title={sItem.stageName} onClick={(e: any) => setSelectedItem({ ...selectedItem, "stageID": sItem.stageID })}></div>
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

    const getCustomElement = (item: IControl) => {
        if (item.key === "Stage") return getJsxForStage();
    }

    const getDropdownvalues = (item: any) => {
        if (item.key === "Pipeline") {
            return getPipeLines() ?? [];
        }
        if (item.key === "Organization") {

            return utility?.organizations.map(({ name, organizationID }) => ({ "name": name, "value": organizationID })) ?? [];
        }
        if (item.key === "Contact Person") {
            return utility?.persons.map(({ personName, personID }) => ({ "name": personName, "value": personID })) ?? [];
        }
        if (item.key === "Pipeline Type") {
            return pipelineTypes ?? [];
        }
    }

    const customFooter = () => {
        return (
            <>
                <div className='modalfootbar'>
                    {/* <div className="modelfootcountcol me-2">
                        <div className="modelfootcount me-2">1608/10000</div>
                        <button className="modelinfobtn"><i className="rs-icon rs-icon-info"></i></button>
                    </div> */}
                    <button onClick={oncloseDialog} className="btn btn-secondary btn-sm me-2" id="closeDialog">Cancel</button>
                    <button type="submit" className={`btn btn-primary btn-sm save`} onClick={handleSubmit(onSubmit)}>{"Save"}</button>
                </div>
            </>
        )
    }

    return (
        <>
            {
                <FormProvider {...methods}>
                    <AddEditDialog dialogIsOpen={dialogIsOpen}
                        header={"Add Deal"}
                        closeDialog={oncloseDialog}
                        onClose={oncloseDialog}
                        onSave={handleSubmit(onSubmit)}
                        customFooter={customFooter()}
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
                                                        getCustomElement={(item: IControl) => getCustomElement(item)}
                                                        showDelete={false} 
                                                    />
                                                ))
                                            }
                                            <br />
                                        </div>
                                    </div>
                                </div>

                            </>

                        }
                    </AddEditDialog>
                </FormProvider>
            }
        </>
    )
}