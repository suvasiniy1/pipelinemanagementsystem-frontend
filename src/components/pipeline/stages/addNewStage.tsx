export const AddNewStage = (props:any) => {
    return (
        <div className="editstage-col editstage-newcol">
            <div className="addnewstagbox">
                <div className="addnewstag-innbox">
                    <div className="addnewstagbox-text">
                        <h3>Add new stage</h3>
                        <p>Pipeline stages represent the steps in your sales process</p>
                    </div>
                    <button className="addnewstag-btn" onClick={(e:any)=>props.onAddClick()}><i className="rs-icon rs-icon-plus"></i><span>New stage</span></button>
                </div>
            </div>
        </div>
    )
}