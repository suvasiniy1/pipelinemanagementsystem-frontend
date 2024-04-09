import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLocationCrosshairs, faDollarSign, faClipboardCheck, faBullhorn, faBox } from '@fortawesome/free-solid-svg-icons';

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
                {/* <div className="quickadd-menu">
                    <Dropdown className="quickadd-menuicon">
                        <Dropdown.Toggle id="quick-dropdown-autoclose-true"><FontAwesomeIcon icon={faPlus} /></Dropdown.Toggle>
                        <Dropdown.Menu className='quickadd-menulist'>
                            <Dropdown.ItemText><FontAwesomeIcon icon={faLocationCrosshairs} /> Leads</Dropdown.ItemText>
                            <Dropdown.ItemText><FontAwesomeIcon icon={faDollarSign} /> Deals</Dropdown.ItemText>
                            <Dropdown.ItemText><FontAwesomeIcon icon={faClipboardCheck} /> Projects</Dropdown.ItemText>
                            <Dropdown.ItemText><FontAwesomeIcon icon={faBullhorn} /> Campaigns</Dropdown.ItemText>
                            <Dropdown.ItemText><FontAwesomeIcon icon={faBox} /> Products</Dropdown.ItemText>
                        </Dropdown.Menu>
                    </Dropdown>
                </div> */}
            </div>

        </>
    );
}