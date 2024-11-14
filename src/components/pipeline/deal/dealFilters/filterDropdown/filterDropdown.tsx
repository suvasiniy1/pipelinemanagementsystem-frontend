import React, { useEffect, useState } from "react";
import "./filterDropdown.css"; // Import the CSS file
import OutsideClickHandler from "react-outside-click-handler";
import DealFilterAddEditDialog from "../dealFilterAddEditDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DealFilter } from "../../../../../models/dealFilters";
import { Spinner } from "react-bootstrap";

type params = {
  showPipeLineFilters: any;
  setShowPipeLineFilters: any;
};

const FilterDropdown = (props: params) => {
  const { showPipeLineFilters, setShowPipeLineFilters, ...others } = props;
  const [selectedFilter, setSelectedFilter] = useState<DealFilter>(
    new DealFilter()
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState<Array<DealFilter>>(
    JSON.parse(localStorage.getItem("dealFilters") as any) ?? []
  );

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

  const loadFilters = () => {
    setFilters(JSON.parse(localStorage.getItem("dealFilters") as any) ?? []);
    setIsLoading(false);
  };

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
                <li
                  key={index}
                  onClick={(e: any) => {
                    setDialogIsOpen(true);
                    setSelectedFilter(item);
                  }}
                >
                  <button className="pipeselectlink" type="button">
                    {item.name}{" "}
                    {/* <span
                  hidden={
                    selectedItem?.pipelineID != item.pipelineID ||
                    item.canEdit
                  }
                >
                  <FontAwesomeIcon icon={faCheck} />
                </span> */}
                  </button>
                  {/* <span className="pipeselect-editlink" hidden={!item.canEdit}>
                <FontAwesomeIcon icon={faPencil} />
              </span> */}
                </li>
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
            loadFilters();
            setDialogIsOpen(false);
          }}
          selectedFilter={selectedFilter as any}
          setSelectedFilter={setSelectedFilter}
        />
      )}
    </>
  );
};

export default FilterDropdown;
