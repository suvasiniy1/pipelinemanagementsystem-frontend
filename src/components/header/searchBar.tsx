import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export const SearchBar = () => {
    return (
        <>
            <div className="d-flex headsearchrow align-items-center">
                <div className="ui headsearch">
                    <div className="ui icon headinput">
                        <input
                            //   value={props.contactsValue}
                            //   onChange={props.onChangeHandler}
                            className="form-control"
                            type="text"
                            placeholder="Search"
                        />
                        <i className="rs-icon rs-icon-search" />
                    </div>
                    <div className="results" />
                </div>
                <div className="searchicon">
                    <AddCircleOutlineIcon/>
                </div>
            </div>

        </>
    );
}