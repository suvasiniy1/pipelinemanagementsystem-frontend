import SettingsIcon from '@material-ui/icons/Settings';
import { Stage } from '../../models/stage';
import { useNavigate } from 'react-router-dom';

type params = {
    canAddDeal: boolean,
}
export const DashboardHeader = (props: params) => {

    const navigate = useNavigate();
    const { canAddDeal, ...others } = props;

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
                <button type="button" className="btn btn-success" disabled={!canAddDeal}>+ Add Deal</button>
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
        </>
    )
}