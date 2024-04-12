import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { AddEditDialog } from '../../../common/addEditDialog';
import GenerateElements from '../../../common/generateElements';
import { UnAuthorized } from '../../../common/unauthorized';
import { Deal, DealMove } from '../../../models/deal';
import { ElementType, IControl } from '../../../models/iControl';
import { PipeLine } from '../../../models/pipeline';
import { Stage } from '../../../models/stage';
import Util from '../../../others/util';
import { DealService } from '../../../services/dealService';
import { StageService } from '../../../services/stageService';

type params = {
    dialogIsOpen: boolean;
    setDialogIsOpen: any;
    pipeLinesList: Array<PipeLine>;
    selectedPipeLineId: number;
    selectedStageId: number;
    dealId: number;
    onDealModify: any;
    deal: Deal;
}
const MoveDeal = (props: params) => {

    const { dialogIsOpen, setDialogIsOpen, pipeLinesList, selectedStageId, selectedPipeLineId, dealId, deal, ...others } = props;
    const [selectedItem, setSelectedItem] = useState<DealMove>({ ...new DealMove(), "pipelineId": selectedPipeLineId ?? pipeLinesList[0].pipelineID });
    const [isLoading, setIsLoading] = useState(false);
    const [stages, setStages] = useState<Array<Stage>>([]);
    const stagesSvc = new StageService(ErrorBoundary);
    const dealsSvc = new DealService(ErrorBoundary);
    const userProfile = Util.UserProfile();
    const [error, setError] = useState<AxiosError>();

    const controlsList: Array<IControl> = [
        { key: "Pipeline", value: "pipelineId", type: ElementType.dropdown, isControlInNewLine: true },
        { key: "Stage", value: "newStageId", type: ElementType.custom, isControlInNewLine: true },
    ];

    useEffect(() => {
        loadStages(props.selectedPipeLineId);
    }, [props.selectedPipeLineId])

    const loadStages = (selectedPipeLineId: number) => {
        if (selectedPipeLineId > 0) {
            setIsLoading(true);
            stagesSvc.getStages(selectedPipeLineId).then(items => {
                let sortedStages = Util.sortList(items.stageDtos, "stageOrder");
                setStages(sortedStages);
                setSelectedItem({ ...selectedItem, "pipelineId": +selectedPipeLineId, "newStageId": selectedStageId ?? items.stageDtos[0]?.stageID });
                setIsLoading(false);
            }).catch(err => {
            });
        }
    }

    const getValidationsSchema = (list: Array<any>) => {
        return Yup.object().shape({
            ...Util.buildValidations(list)
        });
    }

    const formOptions = {
        resolver: yupResolver(getValidationsSchema(controlsList))
    };

    const methods = useForm(formOptions);
    const { handleSubmit, resetField, setValue } = methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    const onSubmit = () => {
        dealsSvc.putItemBySubURL({
            "newStageId": +selectedItem.newStageId,
            "modifiedById": userProfile.userId,
            "dealId": +dealId,
            "pipelineId": selectedItem?.pipelineId
        }, +dealId + "/stage").then(res => {
            setDialogIsOpen(false);
            props.onDealModify();
        }).catch(err => {
            setError(err);
        })
    }

    const onChange = (value: any, item: any) => {

        if (item.key === "Pipeline") {
            setSelectedItem({ ...selectedItem, "pipelineId": +value > 0 ? +value : null as any });
            setStages([]);
            setValue("pipelineId" as never, +value as never)
            if (+value > 0) loadStages(+value);
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

    const getCustomElement = (item: IControl) => {
        if (item.key === "Stage") return getJsxForStage();
    }

    const getDropdownvalues = (item: any) => {
        if (item.key === "Pipeline") {
            return getPipeLines() ?? [];
        }
    }

    const getJsxForStage = () => {
        return (
            <div className="col-sm-6 pipelinestage-selector pipelinestage-active" aria-disabled={isLoading}>
                {
                    stages.map((sItem, sIndex) => (
                        <label key={sIndex} className={'pipelinestage ' + (sItem.stageID == selectedItem.newStageId ? 'pipelinestage-current' : '')} aria-label={sItem.stageName} title={sItem.stageName} onClick={(e: any) => setSelectedItem({ ...selectedItem, "newStageId": sItem.stageID })}></label>
                    ))
                }
            </div>
        )
    }

    return (
        error ? <UnAuthorized error={error as any} /> :
            <>
                <FormProvider {...methods}>
                    <AddEditDialog dialogIsOpen={dialogIsOpen}
                        dialogSize="default"
                        header={"Move Deal"}
                        closeDialog={oncloseDialog}
                        onClose={oncloseDialog}
                        onSave={handleSubmit(onSubmit)}>
                        {isLoading && <div className="alignCenter"><Spinner /></div>}
                        <>
                            <div className='modelformfiledrow'>
                                <div className='dealbystage-popuprow'>
                                    <div className="pdstage-item">
                                        <div className='pdstage-box'>
                                            <a className='pdstage-boxlink' href=''>
                                                <div className="pdstage-title">{deal?.name}</div>
                                                <div className="pdstage-description">
                                                    <div className="pdstage-descitem">{deal?.title}</div>
                                                </div>
                                                <div className="pdstage-status-row">
                                                    <div className="pdstage-avatar">
                                                        <i className="rs-icon rs-icon-user-circle"></i>
                                                    </div>
                                                    <div className="pdstage-value">
                                                        <span>£{deal?.value}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='modelformbox ps-2 pe-2'>
                                        {
                                            <GenerateElements
                                                controlsList={controlsList}
                                                selectedItem={selectedItem}
                                                onChange={(value: any, item: any) => onChange(value, item)}
                                                getListofItemsForDropdown={(e: any) => getDropdownvalues(e) as any}
                                                getCustomElement={(item: IControl) => getCustomElement(item)}
                                            />
                                        }
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </>
                    </AddEditDialog >
                </FormProvider >
    
            </>
    )
}

export default MoveDeal