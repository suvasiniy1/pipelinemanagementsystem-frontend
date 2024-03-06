import SettingsIcon from '@material-ui/icons/Settings';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DealAddEditDialog } from './dealAddEditDialog';
import SelectDropdown from '../../../elements/SelectDropdown';
import { PipeLine } from '../../../models/pipeline';


type params = {
    canAddDeal: boolean,
    onSaveChanges: any,
    selectedItem: PipeLine,
    setSelectedItem: any,
    pipeLinesList: Array<PipeLine>
}
export const DealHeader = (props: params) => {

    const navigate = useNavigate();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const { canAddDeal, onSaveChanges, selectedItem, setSelectedItem, pipeLinesList, ...others } = props;

    const addorUpdateStage = () => {
        return (
            <>
                <button type="button" className="btn btn-primary" onClick={(e: any) => navigate("/pipeline/edit")}> <SettingsIcon /></button>
            </>
        )
    }

    const addorUpdateDeal = () => {
        return (
            <>
                <button type="button" className="btn btn-success" onClick={(e: any) => setDialogIsOpen(true)} disabled={!canAddDeal}>+ Add Deal</button>
            </>
        )
    }

    return (
        <>
            <div className="pipe-toolbar pt-3 pb-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-8 toolbarview-actions">

                            {addorUpdateDeal()}
                        </div>
                        <div className="col-sm-4 toolbarview-filters">
                            <div className="row">
                                <div className='col-sm-8 toolbarview-filtersrow'>
                                    <select className="form-control"
                                            value={selectedItem?.pipelineID}
                                            key={"region"}
                                            onChange={(e: any) => setSelectedItem(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {pipeLinesList?.map((item: PipeLine, index: number) => {
                                            return (
                                                <option key={index} value={item.pipelineID}>{item.pipelineName}</option>
                                            );
                                        }
                                        )}
                                    </select>
                                </div>
                                <div className='col-sm-2 toolbarview-filtersrow'>
                                    {addorUpdateStage()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                dialogIsOpen && <DealAddEditDialog dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                    onSaveChanges={(e: any) => props.onSaveChanges()} />
            }

        </>
    )
}