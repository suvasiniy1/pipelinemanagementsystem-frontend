import SettingsIcon from '@material-ui/icons/Settings';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DealAddEditDialog } from './dealAddEditDialog';


type params = {
    canAddDeal: boolean,
    onSaveChanges: any,
}
export const DealHeader = (props: params) => {

    const navigate = useNavigate();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const { canAddDeal, onSaveChanges, ...others } = props;

    const addorUpdateStage = () => {
        return (
            <>
                <button type="button" className="btn btn-primary" onClick={(e: any) => navigate("/pipeline/edit")}> <SettingsIcon /> Edit Stages</button>
            </>
        )
    }

    const addorUpdateDeal = () => {
        return (
            <>
                <button type="button" className="btn btn-success" onClick={(e: any) => setDialogIsOpen(true)} disabled={!canAddDeal}>+ Deal</button>
            </>
        )
    }

    return (
        <>
            <div className="pipe-toolbar pt-3 pb-3">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3 toolbarview-actions">

                            {addorUpdateDeal()}
                        </div>
                        <div className="col-sm-6 toolbarview-summary">

                        </div>
                        <div className="col-sm-3 toolbarview-filters">
                            <div className='toolbarview-filtersrow'>
                                {addorUpdateStage()}
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