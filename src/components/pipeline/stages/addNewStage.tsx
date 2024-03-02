type params = {
    onAddClick: any,
    onSaveClick:any,
    onCancelClick:any
}
export const AddNewStage = (props: params) => {
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
                        <div className="col-sm-8 colactionbtnstage">
                            <button type="button" className="btn btn-light" onClick={(e: any) => props.onAddClick()}>+ New Stage</button>
                        </div>
                        <div className="col-sm-4 colactionbtn">
                            <div className="colactionbtnrow">
                                <button type="button" className="btn btn-light" onClick={(e: any) => props.onCancelClick()}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={(e: any) => props.onSaveClick()}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}