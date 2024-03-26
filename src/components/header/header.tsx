import { faBars, faBell, faEnvelope, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./header.css";
import { SearchBar } from "./searchBar";
import { Profile } from '../other/Profile';

type params={
    onExpandCollapseClick:any
}
export const HeaderComponent = (props:params) => {
    return (
        <header id="header" className="header pt-2 pb-2">
            <div className="container-fluid">
                <div className="headerrow align-items-center">
                    <div className="header-col colheadname">
                        <div className="colheadname-row">
                            <button className="sidemenuicon" onClick={(e:any)=>props.onExpandCollapseClick()}><FontAwesomeIcon icon={faBars} /></button>
                            <h1 className="headname">Deals</h1>
                        </div>
                    </div>
                    <div className="header-col colheadsearch">
                        <SearchBar />
                    </div>
                    <div className="header-col colheadprofile">                        
                        <div className="colheadprofilerow">
                            <div className="headicon headbtngear">
                                <button><FontAwesomeIcon icon={faGear} /></button>
                            </div>
                            <div className="headicon headbtnbell">
                                <button><FontAwesomeIcon icon={faBell} /></button>
                            </div>
                            <div className="headicon headbtnenvelope">
                                <button><FontAwesomeIcon icon={faEnvelope} /></button>
                            </div>
                            <Profile />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

