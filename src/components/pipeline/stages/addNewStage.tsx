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
            <div className="from-group row">
                <div className="col-sm-8" style={{ paddingLeft: 10 }}>
                    <button type="button" className="btn btn-light" onClick={(e: any) => props.onAddClick()}>+ New Stage</button>
                </div>
                <div className="col-sm-4">
                    <button type="button" className="btn btn-light" onClick={(e: any) => props.onCancelClick()}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={(e: any) => props.onSaveClick()}>Save Changes</button>
                </div>
            </div>


        </>
    )
}