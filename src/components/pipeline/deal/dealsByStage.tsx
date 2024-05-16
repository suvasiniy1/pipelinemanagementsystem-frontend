
import React, { useEffect, useState } from 'react'
import { StageService } from '../../../services/stageService';
import { ErrorBoundary } from 'react-error-boundary';
import { Deal } from '../../../models/deal';
import { AddEditDialog } from '../../../common/addEditDialog';
import { Spinner } from 'react-bootstrap';
import { AxiosError } from 'axios';
import { UnAuthorized } from '../../../common/unauthorized';

type params = {
    stageId: number;
    stageName:string;
    dialogIsOpen: boolean;
    setDialogIsOpen: any;
}
const DealsByStage = (props: params) => {
    const { stageId, stageName, dialogIsOpen, setDialogIsOpen, ...others } = props;
    const stageSvc = new StageService(ErrorBoundary);
    const [dealsLIst, setDealsList]=useState<Array<Deal>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AxiosError>();
    
    useEffect(()=>{
        setIsLoading(true);
        stageSvc.getDealsbyStageId(stageId).then(res=>{
            if(res && res.deals){
              setDealsList(res?.deals);
            }
            setIsLoading(false);
        }).catch(err=>{
            setError(err);
        })
    },[stageId])

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    const customFooter=()=>{
        return(
            <>
              <button onClick={oncloseDialog} className="btn btn-secondary btn-sm me-2" id="closeDialog">Close</button>
            </>
        )
    }

    return (
        <AddEditDialog dialogIsOpen={dialogIsOpen}
        header={`Deals under ${stageName}`}
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
        customFooter={customFooter()}
        disabled={isLoading}>
        {
            <>
                {isLoading && <div className="alignCenter"><Spinner /></div>}
                <div className='modelformfiledrow dealbystage-popup'>
                    <div className='dealbystage-popuprow' hidden={dealsLIst.length==0}>
                        {
                            dealsLIst?.map((deal, dIndex)=>(
                                <div className="pdstage-item">
                                <div className='pdstage-box'>
                                  <a className='pdstage-boxlink' href=''>
                                    <div className="pdstage-title">{deal?.name}</div>
                                    <div className="pdstage-description">
                                      <div className="pdstage-descitem">{deal?.personName}</div>
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
                                  {/* <div className="pdstage-status-indicator">
                                    <div className='pdstage-indicator-icon'><i className="rs-icon rs-icon-arrow-circle-left"></i></div>
                                  </div> */}
                                </div>
                              </div>
                            ))
                        }
                    </div>
                    <div className="alignCenter" hidden={dealsLIst.length>0 || isLoading}>
                      No deals are available for {stageName}
                    </div>
                </div>
                {error && <UnAuthorized error={error as any} />}

            </>

        }
    </AddEditDialog>
    )
}

export default DealsByStage