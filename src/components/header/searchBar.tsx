import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export const SearchBar = () => {
    return (
        <>
            <div className="form-group row">
                <div className="ui search col-sm-8">
                    <div className="ui icon input">
                        <input
                            //   value={props.contactsValue}
                            //   onChange={props.onChangeHandler}
                            className="form-control"
                            type="text"
                            placeholder="Search Pipedrive"
                        />
                        <i className="search icon" />
                    </div>
                    <div className="results" />
                </div>
                <div className="col-sm-4 pt-2">
                    <AddCircleOutlineIcon/>
                </div>
            </div>

        </>
    );
}