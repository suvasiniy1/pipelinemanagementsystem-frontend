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
  const [pageSize, setPageSize] = useState(10);
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
  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );

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
    stagesSvc
      .getAllDealsByPipelines(currentPage, pageSize)
      .then((response) => {
        if (response && Array.isArray(response.dealsDtos)) {
          setDealsList(response.dealsDtos);
        } else {
          console.error("API response is not valid:", response);
          setDealsList([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        setDealsList([]);
      });
  };

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

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    setSelectedRows([]);
    setDrawerOpen(false);
  };

  // const toggleColumnSelection = (columnKey: string) => {
  //   if (selectedColumns.includes(columnKey)) {
  //     setSelectedColumns(selectedColumns.filter((key) => key !== columnKey));
  //   } else {
  //     setSelectedColumns([...selectedColumns, columnKey]);
  //   }
  // };

  const handleExportToExcel = async () => {
    try {
      if (
        selectedPipeLines.length == 0 &&
        !selectedStartDate &&
        !selectedEndDate
      ) {
        alert(
          "Please select at least one pipeline or choose a date range to proceed."
        );
        return;
      }

      if (selectedColumns.length == 0) {
        alert("Please select at least one column to proceed");
        return;
      }

      const dealExport = new DealExport();
      dealExport.startDate = selectedStartDate;
      dealExport.endDate = selectedEndDate;
      dealExport.pipelineIDs = Array.from(
        selectedPipeLines,
        (x) => x.value
      )?.join(",");

      const allDealsResponse = await dealSvc.exportDeal(dealExport);
      const allDeals = Array.isArray(allDealsResponse)
        ? allDealsResponse
        : allDealsResponse?.dealsDtos || [];

      if (!allDeals.length) {
        alert("No deals found to export.");
        return;
      }

      const dataToExport = allDeals.map((deal: any) => {
        const row: any = {};
        selectedColumns.forEach((col) => {
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

      // Reset UI states
      setDrawerOpen(false);
      setSelectedPipeLines([]);
      setSelectedColumns([]);
    } catch (err) {
      console.error("Error exporting all deals:", err);
      alert("Something went wrong while exporting. Please try again.");
    }
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

  const customHeaderActions = () => {
    return (
      <>
        <div className="col-sm-7 toolbarview-summery">
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
                  {/* <Dropdown.Item href="#/action-3">Add New List View</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {addorUpdateDeal()}

            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={(e: any) => setDrawerOpen(true)}
              disabled={selectedRows.length > 0}
              style={{
                minWidth: 140,
                minHeight: 40,
                fontWeight: 600,
                marginRight: 12,
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={(e: any) => setDrawerOpen(true)}
              disabled={selectedRows.length == 0}
              style={{ minWidth: 140, minHeight: 40, fontWeight: 600 }}
            >
              Send SMS
            </Button>
            {/* New dropdown with 3 dots menu for bulk actions like Sales Dialer */}
            {selectedRows.length > 0 && (
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-bulk-actions">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleOpenSalesDialer}>
                    JustCall Sales Dialer
                  </Dropdown.Item>
                  {/* Add more bulk actions if needed */}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
      </>
    );
  };
  // Function to handle opening sales dialer with selected contacts
  const handleOpenSalesDialer = () => {
     setSalesDialerDrawerOpen(true);
  };

  const addorUpdateDeal = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={(e: any) => setOpenAddDealDialog(true)}
          style={{
            minWidth: 140,
            minHeight: 40,
            fontWeight: 600,
            marginLeft: "10px",
            marginRight: "10px",
          }}
          sx={{ backgroundColor: "primary.main", color: "white" }}
        >
          + New Deal
        </Button>
      </>
    );
  };
const getSelectedDeals = () => {
  return dealsList.filter((deal: any) =>
    selectedRows.includes(deal.dealID)
  );
};
  return (
    <>
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
        hidePagination={true} // Ensure DataGrid pagination is hidden
        isCustomHeaderActions={true}
        customHeaderActions={customHeaderActions}
        onSelectionModelChange={handleRowSelection}
      />
      <div className="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={dealsList.length === 0}
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
              <div
                hidden={selectedRows.length > 0}
                style={{ marginBottom: "24px" }}
              >
                <h4>Date Range</h4>
                <DateRangePicker
                  startDate={selectedStartDate}
                  endDate={selectedEndDate}
                  onDatePeriodSelection={onDatePeriodSelection}
                />
              </div>

              <div
                hidden={selectedRows.length > 0}
                style={{ marginBottom: "24px" }}
              >
                <h4>PipeLines</h4>
                <MultiSelectDropdown
                  list={getPipeLinesList()}
                  selectedList={selectedPipeLines}
                  onItemChange={(e: any) => onPipeLineSelection(e)}
                />
              </div>

              <div
                hidden={selectedRows.length > 0}
                style={{ marginBottom: "24px" }}
              >
                <h4>Columns</h4>
                <MultiSelectDropdown
                  list={getFiltersList()}
                  selectedList={selectedColumns}
                  onItemChange={(e: any) => onColumnSelection(e)}
                />
              </div>

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

                <Grid item>
                  <div style={{ marginBottom: "12px" }}>
                    <label className="fw-bold">Export Format</label>
                    <div>
                      <label style={{ marginRight: "12px" }}>
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
                    hidden={selectedRows.length > 0}
                    onClick={(e: any) => handleExportToExcel()}
                  >
                    Export
                  </Button>
                </Grid>
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
