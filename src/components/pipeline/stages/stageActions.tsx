import { PipeLine } from "../../../models/pipeline"

type params = {
    selectedItem:PipeLine;
    onAddClick: any,
    onSaveClick:any,
    onCancelClick:any,
    canSave:boolean
}
export const StageActions = (props: params) => {
    const {selectedItem, canSave, ...others}=props;
    return (
        <>
            {/* <div>
            <h3>Add new stage</h3>
            <br/>
            <p>Pipeline stages represent the steps in your sales process</p>
            <br/>
            </div> */}
            <div className="action-toolbar pt-3 pb-3">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-2 colactionbtnstage">
                        <div className="form-group row">
                        <label htmlFor="name">Pipeline Name:</label>
                        <input type="text" className="form-control" defaultValue={selectedItem?.pipelineName}/>
                        </div>
                           
                        </div>
                        <div className="col-sm-4 colactionbtn">
                            <div className="colactionbtnrow">
                                <button type="button" className="btn btn-light" onClick={(e: any) => props.onCancelClick()}>Cancel</button>
                                <button type="button" className="btn btn-primary" disabled={!canSave}  onClick={(e: any) => {if(!canSave) return; props.onSaveClick()}}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}