import { faGrip, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import axios, { AxiosError } from "axios";
import { saveAs } from "file-saver";
import moment from "moment";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import ItemCollection from "../../../common/itemCollection";
import { UnAuthorized } from "../../../common/unauthorized";
import { DateRangePicker } from "../../../elements/dateRangePicker";
import MultiSelectDropdown from "../../../elements/multiSelectDropdown";
import { Deal, DealExport } from "../../../models/deal";
import { PipeLine } from "../../../models/pipeline";
import { Utility } from "../../../models/utility";
import Constants from "../../../others/constants";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Util from "../../../others/util";
import { DealService } from "../../../services/dealService";
import { PipeLineService } from "../../../services/pipeLineService";
import { StageService } from "../../../services/stageService";
import { DealExportPrview } from "./dealExportPreview";
import { DealAddEditDialog } from "./dealAddEditDialog";
import JustCallCampaignManager from "./justCallCampaignManager";
import JustCallCampaignModal from "./justCallCampaignModal";
import FilterDropdown from "./dealFilters/filterDropdown/filterDropdown";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DoneIcon from "@mui/icons-material/Done";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

type Params = {
  pipeLineId: number;
  setViewType: any;
  onSaveChanges: any;
  pipeLinesList: any;
  selectedStageId: any;
};

const DealListView = (props: Params) => {
  const {
    pipeLineId,
    setViewType,
    onSaveChanges,
    pipeLinesList,
    selectedStageId,
    ...others
  } = props;
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [dealsList, setDealsList] = useState<Array<Deal>>([]);
  const [isLoading, setIsLoading] = useState(false);

    const [paginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({
    page: 0,
    pageSize: 8,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [pipeLines, setPipeLines] = useState<Array<PipeLine>>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const [selectedPipeLines, setSelectedPipeLines] = useState<Array<any>>([]);
  const [previewData, setPreviewData] = useState<any[]>([]); // Preview data for export
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [openAddDealDialog, setOpenAddDealDialog] = useState(false);
  const [isMessageEmpty, setIsMessageEmpty] = useState(false);
  const [to, setTo] = useState<string>("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
    const utility: Utility = JSON.parse(
      LocalStorageUtil.getItemObject(Constants.UTILITY) as any
    );
   const [users, setUsers]=useState<Array<any>>(utility?.users);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "",
    direction: "asc",
  });
  const [totalColumns, setTotalColumns] = useState<
    { key: string; label: string; selected?: boolean }[]
  >([]);
  const stagesSvc = new StageService(ErrorBoundary);
  const dealSvc = new DealService(ErrorBoundary);
  const pipeLineSvc = new PipeLineService(ErrorBoundary);
 const [pageSize, setPageSize] = useState(10);
 
  const columnMetaData = [
    { columnName: "stageName", columnHeaderName: "Stage", width: 150 },
    {
      columnName: "treatmentName",
      columnHeaderName: "Treatment Name",
      width: 150,
    },
    { columnName: "value", columnHeaderName: "Value" },
    {
      columnName: "organization",
      columnHeaderName: "Organisation",
      width: 150,
    },
    {
      columnName: "contactPerson",
      columnHeaderName: "Contact Person",
      width: 150,
    },
    { columnName: "phone", columnHeaderName: "Phone", width: 150 },
    {
      columnName: "expectedCloseDate",
      columnHeaderName: "Expected Close Date",
      width: 150,
    },
    {
      columnName: "operationDate",
      columnHeaderName: "Next Activity Date",
      width: 150,
    },
  ];

  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [salesDialerDrawerOpen, setSalesDialerDrawerOpen] = useState(false);
  const [showPipeLineFilters, setShowPipeLineFilters] = useState(false);
  const [selectedFilterObj, setSelectedFilterObj] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<any>(null);
  const [dealFilterDialogIsOpen, setDealFilterDialogIsOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);



  const userProfile = JSON.parse(
    LocalStorageUtil.getItem(Constants.USER_PROFILE) || "{}"
  );
  const userRole = userProfile?.role || 2;

  const getOrganizationName = (orgId: number) =>
    utility.organizations.find((o) => o.organizationID === orgId)?.name ||
    "N/A";

  const getContactPersonName = (personId: number | null | undefined) =>
    personId !== undefined
      ? utility.persons.find((p) => p.personID === personId)?.personName ||
        "No Contact"
      : "No Contact";
  const getContactPersonPhone = (personId: number | null | undefined) =>
    personId !== undefined
      ? utility.persons.find((p) => p.personID === personId)?.phone || "N/A"
      : "N/A";

  useEffect(() => {
    loadDeals();
    loadPipeLines();
  }, [currentPage]);

  useEffect(() => {
    if (dealsList.length > 0) {
      const firstDeal = dealsList[0];

      const dynamicColumns = Object.keys(firstDeal).map((key) => ({
        key,
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()), // optional: prettify key names
      }));

      setTotalColumns(dynamicColumns);
    }
  }, [dealsList]);

  const loadPipeLines = () => {
    setIsLoading(true);

    pipeLineSvc
      .getPipeLines()
      .then((res: Array<PipeLine>) => {
        setPipeLines(res);
      })
      .catch((err: AxiosError) => {
        setError(err);
      });
  };

  const loadDeals = () => {
    setIsLoading(true);
    const apiPage = paginationModel.page + 1; // API is 1-based
    const size = paginationModel.pageSize;

    stagesSvc.getAllDealsByPipelines(apiPage, size)
      .then((res) => {
        const rows = res?.dealsDtos?.deals ?? [];
        const total = res?.dealsDtos?.totalCount ?? 0;
        console.log('API totalCount:', total, 'rows:', rows.length);
        setDealsList(rows);
        setTotalCount(total);

        // Clamp page if API says we’re past the end
        const last = Math.max(0, Math.ceil(total / size) - 1);
        if (paginationModel.page > last) {
          setPaginationModel((p) => ({ ...p, page: last }));
        }
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };


  // --- NEW: Load deals by filter or user (mirroring deals.tsx logic) ---
  const loadDealsByFilter = () => {
    setIsLoading(true);
    setError(null as any);

    const apiPage = paginationModel.page + 1;
    const size = paginationModel.pageSize;

    const req =
      selectedUserId > 0
        ? stagesSvc.getDealsByUserId(selectedUserId, pipeLineId, apiPage, size)
        : stagesSvc.getDealsByFilterId(selectedFilterObj?.id, pipeLineId, userProfile.userId, apiPage, size);

    req
      .then((res: any) => {
        const list: Deal[] = [];
        (res?.stages ?? []).forEach((s: any) => (s?.deals ?? []).forEach((d: any) => list.push(d)));
        setDealsList(list);

        // Prefer API total if present; otherwise fall back so DataGrid can compute pages.
        const apiTotal = res?.dealsDtos?.totalCount ?? res?.totalCount ?? 0;
        const inferred = apiTotal || (paginationModel.page * size + list.length + (list.length === size ? size : 0));
        setTotalCount(apiTotal || inferred);

        const last = Math.max(0, Math.ceil((apiTotal || inferred) / size) - 1);
        if (paginationModel.page > last) {
          setPaginationModel((p) => ({ ...p, page: last }));
        }
      })
      .catch((err) => {
        setError(err);
        setDealsList([]);
        setTotalCount(paginationModel.page * size); // conservative fallback
        if (paginationModel.page > 0) setPaginationModel((p) => ({ ...p, page: Math.max(0, p.page - 1) }));
      })
      .finally(() => setIsLoading(false));
  };
// only load pipelines once
useEffect(() => { loadPipeLines(); }, []);
  // --- Update effect to load deals when filter/user/page changes ---
  useEffect(() => {
    if (selectedFilterObj || selectedUserId) loadDealsByFilter();
    else loadDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilterObj, selectedUserId, paginationModel]);


  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedDeals = [...dealsList].sort((a, b) => {
      let aValue: string | number | null | undefined = a[key as keyof Deal];
      let bValue: string | number | null | undefined = b[key as keyof Deal];

      if (key === "contactPersonName") {
        aValue = getContactPersonName(a.contactPersonID);
        bValue = getContactPersonName(b.contactPersonID);
      }

      if (aValue! < bValue!) return direction === "asc" ? -1 : 1;
      if (aValue! > bValue!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setDealsList(sortedDeals);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === dealsList.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(dealsList.map((deal) => deal.dealID));
    }
  };

  useEffect(() => {
    if (selectedRows.length > 0 && dealsList.length > 0) {
      const selectedPhones = dealsList
        .filter((deal: any) => selectedRows.includes(deal.dealID))
        .map((deal: any) => deal.phone)
        .join(",");

      setTo(selectedPhones);
    }
  }, [selectedRows]);

  const handleRowSelection = (id: any) => {
    setSelectedRows(id);
  };


// If we ever land on an empty page (e.g., filters shrink results), bounce back one page.
useEffect(() => {
  if (!isLoading && currentPage > 1 && dealsList.length === 0) {
    setCurrentPage((p) => Math.max(1, p - 1));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [dealsList.length, isLoading]);
  // const toggleColumnSelection = (columnKey: string) => {
  //   if (selectedColumns.includes(columnKey)) {
  //     setSelectedColumns(selectedColumns.filter((key) => key !== columnKey));
  //   } else {
  //     setSelectedColumns([...selectedColumns, columnKey]);
  //   }
  // };
const loadAllDeals = async (): Promise<Array<Deal>> => {
  try {
    const response = await stagesSvc.getAllDealsByPipelines(1, totalCount);
    if (response && Array.isArray(response.dealsDtos.deals)) {
      return response.dealsDtos.deals;
    } else {
      console.warn("Invalid response when loading all deals for export");
      return [];
    }
  } catch (err) {
    console.error("Error loading all deals for export", err);
    return [];
  }
};

  const handleExportToExcel = async (columnsOverride?: any[]) => {
  const columns = columnsOverride ?? selectedColumns;

  if (columns.length === 0) {
    alert("Please select at least one column to proceed");
    return;
  }

  const allDeals = await loadAllDeals();

  if (!allDeals.length) {
    alert("No deals found to export.");
    return;
  }

  const dataToExport = allDeals.map((deal: any) => {
    const row: any = {};
    columns.forEach((col) => {
      row[col.name] = deal[col.value] ?? "N/A";
    });
    return row;
  });

  if (exportFormat === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deals");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, `All_Deals_${new Date().toISOString()}.xlsx`);
  } else {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `All_Deals_${new Date().toISOString()}.csv`);
  }

  setDrawerOpen(false);
};


  const getPipeLinesList = () => {
    return (
      pipeLines.map((item: PipeLine) => ({
        name: item.pipelineName,
        value: item.pipelineID,
      })) ?? []
    );
  };

  const getFiltersList = () => {
    return (
      totalColumns.map((item: any) => ({
        name: item.label,
        value: item.key,
      })) ?? []
    );
  };

  const onPipeLineSelection = (pipeLinesList: any) => {
    let selectedPipeLines: Array<any> = [];
    pipeLinesList?.split(",")?.forEach((p: any) => {
      let pipeLineItem = pipeLines.find((pItem) => pItem.pipelineName === p);
      if (pipeLineItem) {
        pipeLineItem.selected = true;
        selectedPipeLines.push(pipeLineItem);
      }
    });

    setSelectedPipeLines(
      (selectedPipeLines.map((item: PipeLine) => ({
        name: item.pipelineName,
        value: item.pipelineID,
      })) ?? []) as any
    );
  };

  const onColumnSelection = (columns: any) => {
    let selectedColumns: Array<any> = [];
    columns?.split(",")?.forEach((c: any) => {
      let columnItem = totalColumns.find((cItem: any) => cItem.label === c);
      if (columnItem) {
        columnItem.selected = true;
        selectedColumns.push(columnItem);
      }
    });

    setSelectedColumns(
      (selectedColumns.map((item: any) => ({
        name: item.label,
        value: item.key,
      })) ?? []) as any
    );
  };

  const onDatePeriodSelection = (dates: Array<Date>) => {
    if (dates.length > 0) {
      setSelectedStartDate(dates[0]);
      setSelectedEndDate(dates[1]);
    } else {
      setSelectedStartDate(null as any);
      setSelectedEndDate(null as any);
    }
  };

  const handlePreview = () => {
    if (selectedColumns.length == 0) {
      alert("Please select atleast one column to show preview");
      return;
    }
    const previewRows = dealsList.map((deal: any) => {
      const row: any = {};

      selectedColumns.forEach((col: any) => {
        let value = deal[col.value];

        // Special formatting for some fields (optional)
        if (col.value === "value" && value !== undefined) {
          value = `£${value}`;
        }
        if (col.value === "organization" && value) {
          value = getOrganizationName(value); // value = organizationID
        }
        if (col.value === "contactPerson" && value) {
          value = getContactPersonName(value); // value = contactPersonID
        }
        if (
          (col.value === "treatmentName" || col.value === "stageName") &&
          !value
        ) {
          value = "N/A";
        }

        row[col.value] = value !== undefined ? value : "N/A"; // fallback
      });

      return row;
    });

    setPreviewData(previewRows);
    setDialogIsOpen(true);
  };

  const sendSMS = async () => {
    if (Util.isNullOrUndefinedOrEmpty(message)) {
      setIsMessageEmpty(true);
      return;
    }
    try {
      const res = await axios.post(window?.config?.SMSServiceURL, {
        to,
        message,
      });
      setResponse(res.data);
      handleSMSResponse(res.data);
      setMessage(null as any);
      setDrawerOpen(false);
    } catch (err) {
      //   setResponse({ success: false, error: err.message });
    }
  };

  const handleSMSResponse = (response: any) => {
    if (response.status === "success") {
      toast.success("✅ Message sent successfully to all recipients.");
    } else {
      toast.error(response.message);
    }
  };

  const rowTransform = (item: Deal) => {
    item.expectedCloseDate = moment(item.expectedCloseDate).format(
      window.config.DateFormat
    );
    item.operationDate = moment(item.operationDate).format(
      window.config.DateFormat
    );
    item.value =
      userRole === 1
        ? item.value && !isNaN(Number(item.value))
          ? `£${item.value}`
          : "N/A"
        : "£0";
    return {
      ...item,
      organization: getOrganizationName(item.organizationID),
      contactPerson: getContactPersonName(item.contactPersonID), // Person Name here
      phone: getContactPersonPhone(item.contactPersonID), // Person Phone here
    };
  };

  const updateRowData = () => {
    return processRowData(dealsList).map((item, index) => ({
      ...rowTransform(item),
      id: item.dealID || `deal-${index}`,
    }));
  };

  const isISODateString = (value: any): boolean => {
    return (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[\+\-]\d{2}:\d{2})?$/.test(
        value
      )
    );
  };

  const processRowData = (rowData: Array<any>) => {
    rowData.forEach((r) => {
      // Add modifiedBy using fallback logic
      r.modifiedBy = Util.getUserNameById(r.updatedBy ?? r.createdBy);

      // Loop through properties and format ISO date strings
      Object.keys(r).forEach((key) => {
        const value = r[key];
        if (isISODateString(value)) {
          r[key] = moment(value).format(window.config.DateFormat);
        }
      });
    });
    return rowData;
  };

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

  // Reset filter handler
  const handleResetFilter = () => {
    setSelectedFilterObj(null);
    setSelectedUserId(null);
    // Optionally, also close the filter dropdown
    setShowPipeLineFilters(false);
  };

  const customHeaderActions = () => {
    return (
      <div className="col-sm-7 toolbarview-summery">
        <div className="toolbarview-actionsrow" style={{ paddingRight: "20px", display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginRight: 16 }}>
           Total Deals: {totalCount}
          </div>

          <div className="pipeselectbtngroup" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              className="pipeselectbox variantselectbox"
              onClick={(e: any) =>
                setShowPipeLineFilters(!showPipeLineFilters)
              }
            >
              <button className="pipeselect" type="button">
                <FontAwesomeIcon icon={faChartSimple} />{" "}
                <span>
                  {selectedFilterObj?.name ??
                    users?.find((u) => u.id === selectedUserId)?.name ??
                    "Select"}{" "}
                </span>
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
                      Filters
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
                      setDialogIsOpen={setDealFilterDialogIsOpen}
                      dialogIsOpen={dealFilterDialogIsOpen}
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
                                  onClick={(e: any) =>
                                    onPersonSelection(item.name)
                                  }
                                >
                                  <AccountCircleIcon className="userCircleIcon" />
                                  <span>{item.name}</span>
                                  <div className="filterownerli-icon">
                                    <a
                                      className="filterowner-tick"
                                      hidden={!item.isSelected}
                                    >
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
           

            {(selectedFilterObj || selectedUserId) && (
              <button
                className="btn btn-link p-0 m-0"
                title="Reset Filter"
                style={{ color: '#1976d2', marginLeft: 4 }}
                onClick={handleResetFilter}
              >
                <FilterAltOffIcon fontSize="medium" />
              </button>
            )}
          </div>
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
                onClick={(e: any) => {
                  props.setViewType("list");
                }}
              >
                List View
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(e: any) => {
                  props.setViewType("kanban");
                }}
              >
                Kanban View
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* 3 dots menu for all other actions, ensure it's not inside a flex with overflow/hidden */}
          <div style={{ position: 'relative', zIndex: 1050 }}>
            <Dropdown align="end">
              <Dropdown.Toggle variant="secondary" id="dropdown-bulk-actions">
                <FontAwesomeIcon icon={faEllipsisV} />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ zIndex: 2000, minWidth: 180 }}>
                <Dropdown.Item onClick={() => setOpenAddDealDialog(true)}>+ New Deal</Dropdown.Item>
                <Dropdown.Item onClick={() => setDrawerOpen(true)} disabled={selectedRows.length > 0}>Export</Dropdown.Item>
                <Dropdown.Item onClick={() => setDrawerOpen(true)} disabled={selectedRows.length === 0}>Send SMS</Dropdown.Item>
                <Dropdown.Item onClick={handleOpenSalesDialer} disabled={selectedRows.length === 0}>JustCall Sales Dialer</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  };
  // Function to handle opening sales dialer with selected contacts
  const handleOpenSalesDialer = () => {
    setSalesDialerDrawerOpen(true);
  };

  const getSelectedDeals = () => {
    return dealsList.filter((deal: any) => selectedRows.includes(deal.dealID));
  };

    const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    setSelectedRows([]);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Show spinner overlay when loading */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.6)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Button variant="text" disabled style={{ background: 'transparent' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Loading...</span>
              <span><svg width="32" height="32" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#1976d2" strokeWidth="5" strokeDasharray="31.415, 31.415" transform="rotate(72.0001 25 25)"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg></span>
            </span>
          </Button>
        </div>
      )}
     

      <ItemCollection
        itemName={"Deals"}
        itemType={Deal}
        columnMetaData={columnMetaData}
        canAdd={false}
        canExport={false}
        canDoActions={false}
        viewAddEditComponent={null}
        checkboxSelection={true}
        rowData={updateRowData()}
        customRowData={true}
        hidePagination={false} // Ensure DataGrid pagination is hidden
   
        isCustomHeaderActions={true}
        customHeaderActions={customHeaderActions}
        onSelectionModelChange={handleRowSelection}
       
        dataGridProps={{
          paginationMode: 'server',
          rowCount: totalCount, 
          paginationModel,                    // ✅ use the state object
          onPaginationModelChange: setPaginationModel, // ✅ update it directly
          pageSizeOptions: [10, 25, 50, 100],
          // getRowId: (row) => row.dealID,    // only if your rows don't have `id`
        }}
      />
      
      <div className="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={dealsList.length === 0 || (currentPage * pageSize >= totalCount)}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      <div className="pdstage-area">
        {error && <UnAuthorized error={error as any} />}

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div
            style={{
              width: "320px",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
             
              <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <div
                    className="p-4 border rounded shadow bg-white"
                    style={{ maxWidth: "400px" }}
                    hidden={selectedRows.length == 0}
                  >
                    <h2 style={{ marginBottom: "8px" }}>Bulk Actions</h2>
                    <p style={{ marginBottom: "24px" }}>
                      {selectedRows.length} deals selected
                    </p>

                    <div className="mb-3">
                      <label
                        htmlFor="messageInput"
                        className="form-label fw-bold"
                      >
                        Message Body
                      </label>
                      <textarea
                        id="messageInput"
                        className="form-control"
                        placeholder="Type your message here..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <p
                        hidden={
                          !Util.isNullOrUndefinedOrEmpty(message) ||
                          !isMessageEmpty
                        }
                        className="text-danger"
                      >
                        Please enter message body
                      </p>
                    </div>

                    <button className="btn btn-primary w-100" onClick={sendSMS}>
                      Send SMS
                    </button>
                  </div>
                </Grid>
{selectedRows.length === 0 && (
  <div style={{ marginTop: 24 }}>
    <h4 style={{ marginBottom: 12 }}>Export Deals</h4>
    <div style={{ marginBottom: 12 }}>
      <label className="fw-bold">Export Format</label>
      <div style={{ marginTop: 8 }}>
        <label style={{ marginRight: 12 }}>
          <input
            type="radio"
            name="exportFormat"
            value="csv"
            checked={exportFormat === "csv"}
            onChange={(e) => setExportFormat(e.target.value)}
          />{" "}
          CSV
        </label>
        <label>
          <input
            type="radio"
            name="exportFormat"
            value="xlsx"
            checked={exportFormat === "xlsx"}
            onChange={(e) => setExportFormat(e.target.value)}
          />{" "}
          Excel (XLSX)
        </label>
      </div>
    </div>
    <Button
  variant="contained"
  fullWidth
  onClick={async () => {
    const allColumns = columnMetaData.map((c) => ({
      name: c.columnHeaderName,
      value: c.columnName,
    }));
    setSelectedColumns(allColumns);

    // Call export after state is set using a local copy instead of waiting
    await handleExportToExcel(allColumns);
  }}
>
  Export
</Button>

  </div>
)}
✅ 

              </Grid>
            </div>
          </div>
        </Drawer>
        <JustCallCampaignModal
          isOpen={salesDialerDrawerOpen}
          onClose={() => setSalesDialerDrawerOpen(false)}
          selectedDeals={getSelectedDeals()}
        />
      </div>
      {dialogIsOpen && (
        <div style={{ zIndex: 8888 }}>
          <DealExportPrview
            previewData={previewData}
            selectedColumns={selectedColumns}
            dialogIsOpen={dialogIsOpen}
            setDialogIsOpen={setDialogIsOpen}
            onConfirmClick={(e: any) => handleExportToExcel()}
          />
        </div>
      )}
      {openAddDealDialog && (
        <DealAddEditDialog
          dialogIsOpen={openAddDealDialog}
          setDialogIsOpen={setOpenAddDealDialog}
          onSaveChanges={(e: any) => props.onSaveChanges()}
          selectedStageId={selectedStageId}
          pipeLinesList={pipeLinesList}
        />
      )}
    </>
  );
};

export default DealListView;
