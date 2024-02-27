import SettingsIcon from '@material-ui/icons/Settings';
import { Stage } from '../../models/stage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DealAddEditDialog } from './deal/dealAddEditDialog';

type params = {
    canAddDeal: boolean,
    onSaveChanges:any,
}
export const DashboardHeader = (props: params) => {

    const navigate = useNavigate();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const { canAddDeal, onSaveChanges, ...others } = props;

    const addorUpdateStage = () => {
        return (
            <>
                <button type="button" className="btn btn-primary" onClick={(e: any) => navigate("/pipeline/edit")}> <SettingsIcon /> Configure Stages</button>
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
            <div className="form-group row" style={{ paddingLeft: 10 }}>
                <div className="col-sm-4">
                    {addorUpdateDeal()}
                </div>
                <div className="col-sm-4">

                </div>
                <div className="col-sm-4" style={{ paddingLeft: 190 }}>
                    {addorUpdateStage()}
                </div>
            </div>
            {
                dialogIsOpen && <DealAddEditDialog  dialogIsOpen={dialogIsOpen}
                                                    setDialogIsOpen={setDialogIsOpen}
                                                    onSaveChanges={(e:any)=>props.onSaveChanges()} />
            }
        </>
    )
}