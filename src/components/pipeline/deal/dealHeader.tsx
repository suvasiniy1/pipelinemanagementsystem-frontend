import SettingsIcon from "@material-ui/icons/Settings";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealAddEditDialog } from "./dealAddEditDialog";
import SelectDropdown from "../../../elements/SelectDropdown";
import { PipeLine } from "../../../models/pipeline";
import { display, marginLeft, width } from "@xstyled/styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faPencil,
  faChartSimple,
  faAlignCenter,
  faBars,
  faDollarSign,
  faCheck,
  faAdd,
  faGripLines,
  faEye,
  faCircleInfo,
  faGrip,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import OutsideClickHandler from "react-outside-click-handler";
import { Stage } from "../../../models/stage";
import Dropdown from "react-bootstrap/Dropdown";
import FilterDropdown from "./dealFilters/filterDropdown/filterDropdown";
import { DealFilter } from "../../../models/dealFilters";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import DoneIcon from '@mui/icons-material/Done';
import { Utility } from "../../../models/utility";
import Constants from "../../../others/constants";
import LocalStorageUtil from "../../../others/LocalStorageUtil";

type params = {
  canAddDeal: boolean;
  onSaveChanges: any;
  selectedItem: PipeLine;
  setSelectedItem: any;
  pipeLinesList: Array<PipeLine>;
  stagesList: Array<Stage>;
  selectedStageId: number;
  onDealDialogClose: any;
  setViewType: any;
  selectedFilterObj:any;
  setSelectedFilterObj:any;
  setSelectedUserId:any;
  selectedUserId:any;
};
export const DealHeader = (props: params) => {
  const navigate = useNavigate();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const {
    canAddDeal,
    onSaveChanges,
    selectedItem,
    setSelectedItem,
    stagesList,
    selectedStageId,
    onDealDialogClose,
    setViewType,
    selectedFilterObj,
    setSelectedFilterObj,
    setSelectedUserId,
    selectedUserId,
    ...others
  } = props;
  const [pipeLinesList, setPipeLinesList] = useState(props.pipeLinesList);
  const [showPipeLineDropdown, setShowPipeLineDropdown] = useState(false);
  const [showPipeLineFilters, setShowPipeLineFilters] = useState(false);
  const [selectedViewType, setSelectedViewType]=useState("kanban");
  const [canEdit, setCanEdit] = useState(false);
  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );
  const [users, setUsers]=useState<Array<any>>(utility?.users);
  
  useEffect(() => {
    setPipeLinesList(props.pipeLinesList);
  }, [props.pipeLinesList]);

  useEffect(() => {
    setDialogIsOpen(props.selectedStageId > 0);
  }, [props.selectedStageId]);

  const onDialogClose = () => {
    setDialogIsOpen(false);
    props.onDealDialogClose();
  };

  const addorUpdateStage = () => {
    return (
      <>
        <button
          type="button"
          className="btn"
          onClick={(e: any) =>
            navigate("/pipeline/edit?pipelineID=" + selectedItem.pipelineID)
          }
        >
          {" "}
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </>
    );
  };

  const addorUpdateDeal = () => {
    return (
      <>
        <button
          type="button"
          className="btn btn-success"
          onClick={(e: any) => setDialogIsOpen(true)}
          disabled={!canAddDeal}
        >
          + New Deal
        </button>
      </>
    );
  };

  const handlePipeLineEdit = (index?: number) => {
    let list = pipeLinesList;
    list.forEach((l, idx) => {
      if (index) l.canEdit = index == idx;
      else l.canEdit = false;
    });
    setPipeLinesList([...list]);
  };

  const pipeLinesJSX = () => {
    return (
      <OutsideClickHandler
        onOutsideClick={(event: any) => {
          event?.stopPropagation();
          setShowPipeLineDropdown(false);
        }}
      >
        <div className="pipeselectcontentinner">
          <div className="pipeselectpadlr">
            <ul
              className="pipeselectlist"
              onMouseLeave={(e: any) => handlePipeLineEdit()}
            >
              {pipeLinesList.map((item, index) => (
                <li
                  key={index}
                  onClick={(e: any) => {setSelectedFilterObj(null); setSelectedItem(item)}}
                  onMouseOver={(e: any) => handlePipeLineEdit(index)}
                >
                  <button className="pipeselectlink" type="button">
                    {item.pipelineName}{" "}
                    <span
                      hidden={
                        selectedItem?.pipelineID != item.pipelineID ||
                        item.canEdit
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </button>
                  <span className="pipeselect-editlink" hidden={!item.canEdit}>
                    <FontAwesomeIcon icon={faPencil} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/*<div className='pipeselectpadlr pipeselectbtm'>
                        <ul className='pipeselectlist'>
                            <li><button className='pipeselectlink' type='button'><FontAwesomeIcon icon={faGripLines} /> Reorder Pipelines</button></li>
                            <li><button className='pipeselectlink' type='button'><FontAwesomeIcon icon={faEye} /> Pipeline Visibility</button></li>
                            <li><button className='pipeselectlink' type='button'><FontAwesomeIcon icon={faPencil} /> Custumize deal cards <a className='pipeselect-infolink'><FontAwesomeIcon icon={faCircleInfo} /></a></button></li>
                            </ul>*
                            </div>*/}
          {/*<div className='pipeselectpadlr pipeselectbtm'>
                        <ul className='pipeselectlist'>
                            <li onClick={(e:any)=>navigate("/pipeline/edit")}><button className='newpipeline' type='button'><FontAwesomeIcon icon={faAdd} /> New pipeline</button></li>
                        </ul>
                    </div>*/}
        </div>
      </OutsideClickHandler>
    );
  };

  useEffect(()=>{
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUserId
          ? { ...user, isSelected: true }
          : { ...user, isSelected: false }
      )
    );
  },[selectedUserId])

  const onPersonSelection=(userName:string)=>{
    setSelectedUserId(users?.find(u=>u.name===userName)?.id as any);
    setSelectedFilterObj(null as any);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.name === userName
          ? { ...user, isSelected: true }
          : { ...user, isSelected: false }
      )
    );
  }

  return (
    <>
      <div className="pipe-toolbar pt-3 pb-3">
        <div className="container-fluid">
          <div className="row toolbarview-row">
            <div className="col-sm-5 toolbarview-actions">
              <div className="toolbarview-filtersrow" hidden={selectedViewType!="kanban"}>
                <div className="pipeselectbtngroup">
                  <div
                    className="pipeselectbox variantselectbox"
                    onClick={(e: any) =>
                      setShowPipeLineDropdown(!showPipeLineDropdown)
                    }
                  >
                    <button className="pipeselect" type="button">
                      <FontAwesomeIcon icon={faChartSimple} />{" "}
                      <span>{selectedItem?.pipelineName ?? "Select"} </span>
                      <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                    <div
                      className="pipeselectcontent"
                      hidden={!showPipeLineDropdown}
                    >
                      {pipeLinesJSX()}
                    </div>
                  </div>
                </div>
                <div className="updatestagebtn">{addorUpdateStage()}</div>

                <div className="pipeselectbtngroup">
                  <div
                    className="pipeselectbox variantselectbox"
                    onClick={(e: any) =>
                      setShowPipeLineFilters(!showPipeLineFilters)
                    }
                  >
                    <button className="pipeselect" type="button">
                      <FontAwesomeIcon icon={faChartSimple} />{" "}
                      <span>{selectedFilterObj?.name ?? users?.find(u=>u.id===selectedUserId)?.name ?? "Select"} </span>
                    </button>
                    <div
                      className="pipeselectcontent pipeselectfilter"
                      hidden={!showPipeLineFilters}
                    >
                      <ul
                        className="nav nav-tabs pipefilternav-tabs"
                        id="myTab"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="filters-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#filters"
                            type="button"
                            role="tab"
                            aria-controls="filters"
                            aria-selected="true"
                          >
                            <span>
                              <FilterListIcon />
                            </span>
                            Filtes
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="owners-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#owners"
                            type="button"
                            role="tab"
                            aria-controls="owners"
                            aria-selected="false"
                          >
                            <span>
                              <PersonOutlineIcon />
                            </span>
                            Owners
                          </button>
                        </li>
                      </ul>
                      <div
                        className="tab-content pipefiltertab-content"
                        id="myTabContent"
                      >
                        <div
                          className="tab-pane fade show active"
                          id="filters"
                          role="tabpanel"
                          aria-labelledby="filters-tab"
                        >
                          <FilterDropdown
                            showPipeLineFilters={showPipeLineFilters}
                            setShowPipeLineFilters={setShowPipeLineFilters}
                            selectedFilterObj={selectedFilterObj}
                            setSelectedFilterObj={setSelectedFilterObj}
                          />
                        </div>
                        <div
                          className="tab-pane fade"
                          id="owners"
                          role="tabpanel"
                          aria-labelledby="owners-tab"
                        >
                          <div className="pipeselectpadlr filterownersbox">
                            {users
                              ?.filter((u) => u.isActive)
                              .map((item, index) => (
                                <>
                                  <ul className="pipeselectlist filterownerslist">
                                    <li>
                                      <div
                                        className="filterownerli-row"
                                        key={index}
                                        onClick={(e:any)=>onPersonSelection(item.name)}
                                      >
                                        <AccountCircleIcon className="userCircleIcon" />
                                        <span>{item.name}</span>
                                        <div className="filterownerli-icon">
                                          {/* <a className="filterowner-star">
                                            <StarIcon />
                                          </a> */}
                                          <a className="filterowner-tick" hidden={!item.isSelected}>
                                            <DoneIcon />
                                          </a>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pipefilterbtn">
                  <div className="filterbtn">
                    <a
                      className="btn"
                      href="javascript:void(0);"
                      onClick={(e: any) => {setSelectedUserId(null); setSelectedFilterObj(null)}}
                    >
                      <FilterAltOffIcon />
                    </a>
                  </div>
                </div>

                {/* <div className="pipeselectbox selecteveryonebox">
                                    <button className="pipeselect" type="button"><FontAwesomeIcon icon={faAlignCenter} /> Everyone <FontAwesomeIcon icon={faCaretDown} /></button>
                                </div> */}
              </div>
            </div>
            <div className="col-sm-7 toolbarview-summery">
              {/* <div className="toolsummary pr-4"><div className="toolsummary-deals">£0 <span>·</span>{stagesList?.reduce((count, current) => count + current.deals.length, 0)} deals</div></div> */}
              <div className="toolbarview-actionsrow">
                <div className="d-flex toolbutton-group">
                  <Dropdown className="toolgrip-dropdownbox">
                    <Dropdown.Toggle
                      className="toolpipebtn activetoolbtn"
                      variant="success"
                      id="dropdown-toolgrip"
                    >
                      <FontAwesomeIcon icon={faGrip} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="toolgrip-dropdown">
                      <Dropdown.Item
                        onClick={(e: any) => {setSelectedViewType("list"); props.setViewType("list")}}
                      >
                        List View
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e: any) => {setSelectedViewType("kanban"); props.setViewType("kanban")}}
                      >
                        Kanban View
                      </Dropdown.Item>
                      {/* <Dropdown.Item href="#/action-3">Add New List View</Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* <button className="toolpipebtn activetoolbtn" type="button"><FontAwesomeIcon icon={faChartSimple} /></button>
                                    <button className="tooldealbtn" type="button"><FontAwesomeIcon icon={faBars} /></button>
                                    <button className="tooltimebtn" type="button"><FontAwesomeIcon icon={faDollarSign} /></button> */}
                </div>
                {addorUpdateDeal()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {dialogIsOpen && (
        <DealAddEditDialog
          dialogIsOpen={dialogIsOpen}
          setDialogIsOpen={(e: any) => onDialogClose()}
          onSaveChanges={(e: any) => props.onSaveChanges()}
          selectedStageId={selectedStageId}
          pipeLinesList={pipeLinesList}
        />
      )}
    </>
  );
};
