import SettingsIcon from '@material-ui/icons/Settings';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DealAddEditDialog } from './dealAddEditDialog';
import SelectDropdown from '../../../elements/SelectDropdown';
import { PipeLine } from '../../../models/pipeline';
import { width } from '@xstyled/styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faPencil, faChartSimple, faAlignCenter, faBars, faDollarSign} from '@fortawesome/free-solid-svg-icons';



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
                <button type="button" className="btn" onClick={(e: any) => navigate("/pipeline/edit")}> <FontAwesomeIcon icon={faPencil} /></button>
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
            <div className="pipe-toolbar pt-3 pb-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3 toolbarview-actions">
                            <div className='toolbarview-actionsrow'>
                                <div className="d-flex toolbutton-group">
                                    <button className="toolpipebtn" type="button"><FontAwesomeIcon icon={faChartSimple} /></button>
                                    <button className="tooldealbtn" type="button"><FontAwesomeIcon icon={faBars} /></button>
                                    <button className="tooltimebtn" type="button"><FontAwesomeIcon icon={faDollarSign} /></button>
                                </div>
                                {addorUpdateDeal()}
                            </div>
                        </div>
                        <div className="col-sm-5 toolbarview-summery">
                        
                        </div>
                        <div className="col-sm-4 toolbarview-filters d-flex">
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
                            <div className='toolbarview-filtersrow'>                                    
                                <div className="pipeselectbtngroup">
                                    <div className='pipeselectbox variantselectbox'>
                                        <button className="pipeselect" type="button"><FontAwesomeIcon icon={faChartSimple} /> Workington <FontAwesomeIcon icon={faCaretDown} /></button>
                                    </div>
                                    <div className='updatestagebtn'>{addorUpdateStage()}</div>
                                </div>
                                <div className="pipeselectbox selecteveryonebox">
                                    <button className="pipeselect" type="button"><FontAwesomeIcon icon={faAlignCenter} /> Everyone <FontAwesomeIcon icon={faCaretDown} /></button>
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