import React, { useEffect, useState } from "react";
import "./filterDropdown.css"; // Import the CSS file
import OutsideClickHandler from "react-outside-click-handler";
import DealFilterAddEditDialog from "../dealFilterAddEditDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faDeleteLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { DealFilter } from "../../../../../models/dealFilters";
import { Spinner } from "react-bootstrap";
import { DealFiltersService } from "../../../../../services/dealFiltersService";
import { ErrorBoundary } from "react-error-boundary";
import { DeleteDialog } from "../../../../../common/deleteDialog";
import { toast } from "react-toastify";
import LocalStorageUtil from "../../../../../others/LocalStorageUtil";
import Constants from "../../../../../others/constants";
import DoneIcon from "@mui/icons-material/Done";

type params = {
  showPipeLineFilters: any;
  setShowPipeLineFilters: any;
  selectedFilterObj: any;
  setSelectedFilterObj: any;
};

const FilterDropdown = (props: params) => {
  const {
    showPipeLineFilters,
    setShowPipeLineFilters,
    selectedFilterObj,
    setSelectedFilterObj,
    ...others
  } = props;
  const [selectedFilter, setSelectedFilter] = useState<DealFilter>(
    new DealFilter()
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dealFiltersSvc = new DealFiltersService(ErrorBoundary);
  const [filters, setFilters] = useState<Array<DealFilter>>([]);

  // // Filters Array
  // const filters = [
  //   { name: "All deleted deals", locked: false, section: 1 },
  //   { name: "All lost deals", locked: false, section: 1 },
  //   { name: "All open deals", locked: false, section: 2, favorite: true },
  //   { name: "All won deals", locked: false, section: 2 },
  //   { name: "Deal Stage is Qualified", locked: true, section: 3 },
  //   { name: "More than 3 months old deals", locked: false, section: 3 },
  //   { name: "Rotten deals", locked: false, section: 3 },
  // ];

  // Handle Click
  const handleFilterClick = (filter: any) => {
    if (!filter.locked) {
      setSelectedFilter(filter.name);
    }
  };

  useEffect(() => {
    if (!dialogIsOpen) {
      setSelectedFilter(new DealFilter());
    }
  }, [dialogIsOpen]);

  useEffect(()=>{
    if(selectedFilterObj?.id>0){onFilterSelection(selectedFilterObj)}
  },[selectedFilterObj])

  useEffect(() => {
    loadDealFilters();
  }, []);

  const loadDealFilters = () => {
    setIsLoading(true);
    LocalStorageUtil.setItemObject(Constants.Deal_FILTERS, []);
    dealFiltersSvc
      .getDealFilters()
      .then((res) => {
        if (res) {
          setFilters(res);
          if(selectedFilterObj) onFilterSelection(selectedFilterObj);
          LocalStorageUtil.setItemObject(
            Constants.Deal_FILTERS,
            JSON.stringify(res)
          );
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const hideDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const onDeleteConfirm = () => {
    setShowDeleteDialog(false);
    setIsLoading(true);
    dealFiltersSvc
      .delete(selectedFilter.id)
      .then((res) => {
        setSelectedFilter(new DealFilter());
        if (res) {
          toast.success("Deal filter deleted successfully");
          loadDealFilters();
        }
      })
      .catch((err) => {
        toast.error("Unable to delete deal filter");
      });
  };

  const onFilterSelection=(item:DealFilter)=>{
    
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === item.id
          ? { ...filter, isSelected: true }
          : { ...filter, isSelected: false }
      )
    );
  }

  return isLoading ? (
    <div className="alignCenter">
      <Spinner />
    </div>
  ) : (
    <>
      <OutsideClickHandler
        onOutsideClick={(event: any) => {
          event?.stopPropagation();
          setShowPipeLineFilters(false);
        }}
      >
        <div className="pipeselectcontentinner">
          <div className="pipeselectpadlr">
            <ul
              className="pipeselectlist"
              // onMouseLeave={(e: any) => handlePipeLineEdit()}
            >
              {filters?.map((item, index) => (
                <>
                  <li key={index}>
                    <a hidden={item.isSelected}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                    <a className="filterowner-tick" hidden={!item.isSelected}>
                      <DoneIcon />
                    </a>
                    <button
                      className="pipeselectlink"
                      onClick={(e: React.MouseEvent) => {
                        onFilterSelection(item);
                        setSelectedFilterObj(item);
                      }}
                      type="button"
                    >
                      {item.name}{" "}
                    </button>
                    <div className="pipeselect-btns">
                      <span
                        className="pl-4"
                        onClick={(e: any) => {
                          setDialogIsOpen(true);
                          setSelectedFilter(item);
                        }}
                        style={{ paddingLeft: 10, paddingRight: 10 }}
                      >
                        <FontAwesomeIcon className="pl-4" icon={faEdit} />
                      </span>
                      <span
                        className="pl-4"
                        onClick={(e: any) => {
                          setSelectedFilter(item);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faDeleteLeft} />
                      </span>
                    </div>
                    {/* <span className="pipeselect-editlink" hidden={!item.canEdit}>
                <FontAwesomeIcon icon={faPencil} />
              </span> */}
                  </li>
                </>
              ))}
            </ul>
          </div>
          <div className="add-new-filter">
            <button onClick={(e: React.MouseEvent) => setDialogIsOpen(true)}>
              Add new filter
            </button>
          </div>
        </div>
      </OutsideClickHandler>
      {dialogIsOpen && (
        <DealFilterAddEditDialog
          dialogIsOpen={dialogIsOpen}
          setDialogIsOpen={setDialogIsOpen}
          onSaveChanges={(e: any) => {
            loadDealFilters();
            setDialogIsOpen(false);
          }}
          selectedFilter={selectedFilter as any}
          setSelectedFilter={setSelectedFilter}
        />
      )}
      {showDeleteDialog && (
        <DeleteDialog
          itemType={"Deal Filter"}
          itemName={"Deal Filter"}
          dialogIsOpen={showDeleteDialog}
          closeDialog={hideDeleteDialog}
          onConfirm={onDeleteConfirm}
          isPromptOnly={false}
          actionType={"Delete"}
        />
      )}
    </>
  );
};

export default FilterDropdown;
