import React, { useEffect, useState } from "react";
import { Deal, DealExport } from "../../../models/deal";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import { Utility } from "../../../models/utility";
import Constants from "../../../others/constants";
import { StageService } from "../../../services/stageService";
import { ErrorBoundary } from "react-error-boundary";
import { AxiosError } from "axios";
import { UnAuthorized } from "../../../common/unauthorized";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ImportExportRoundedIcon from "@mui/icons-material/ImportExportRounded";
import { IconButton } from "@mui/material"; // You can use IconButton for a clickable icon
import MultiSelectDropdown from "../../../elements/multiSelectDropdown";
import { PipeLineService } from "../../../services/pipeLineService";
import { PipeLine } from "../../../models/pipeline";
import { toast } from "react-toastify";
import { DealService } from "../../../services/dealService";

type Params = {
  pipeLineId: number;
};

const DealListView = (props: Params) => {
  const [dealsList, setDealsList] = useState<Array<Deal>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [pipeLines, setPipeLines] = useState<Array<PipeLine>>([]);
  const [selectedPipeLines, setSelectedPipeLines] = useState<Array<any>>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "",
    direction: "asc",
  });

  const stagesSvc = new StageService(ErrorBoundary);
  const dealSvc = new DealService(ErrorBoundary);
  const pipeLineSvc = new PipeLineService(ErrorBoundary);

  const allColumns = [
    { key: "stageName", label: "Stage" },
    { key: "treatmentName", label: "Treatment Name" },
    { key: "value", label: "Value" },
    { key: "organization", label: "Organisation" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "expectedCloseDate", label: "Expected Close Date" },
    { key: "operationDate", label: "Next Activity Date" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    allColumns.map((col) => col.key)
  );

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

  useEffect(() => {
    loadDeals();
    loadPipeLines();
  }, [currentPage]);

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
      setDrawerOpen(false);
    } else {
      setSelectedRows(dealsList.map((deal) => deal.dealID));
      setDrawerOpen(true);
    }
  };

  const handleRowSelection = (id: number) => {
    const updatedSelections = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(updatedSelections);
    setDrawerOpen(updatedSelections.length > 0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedRows([]);
    setDrawerOpen(false);
  };

  const toggleColumnSelection = (columnKey: string) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter((key) => key !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  const handleExportToExcel = async () => {
    try {
      
      if (selectedPipeLines.length == 0) {
        toast.warning("Please select atleast one pipeline");
        return;
      }

      const dealExport = new DealExport();
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

      setDrawerOpen(false);

      setSelectedPipeLines([]);

      const dataToExport = allDeals.map((deal: Deal) => {
        const row: any = {};
        if (selectedColumns.includes("stageName"))
          row["Stage"] = deal.stageName;
        if (selectedColumns.includes("treatmentName"))
          row["Treatment Name"] = deal.treatmentName || "N/A";
        if (selectedColumns.includes("value"))
          row["Value"] =
            userRole === 1
              ? deal.value && !isNaN(Number(deal.value))
                ? `£${deal.value}`
                : "N/A"
              : "£0";
        if (selectedColumns.includes("organization"))
          row["Organisation"] = getOrganizationName(deal.organizationID);
        if (selectedColumns.includes("contactPerson"))
          row["Contact Person"] = getContactPersonName(deal.contactPersonID);
        if (selectedColumns.includes("expectedCloseDate"))
          row["Expected Close Date"] = deal.expectedCloseDate
            ? new Date(deal.expectedCloseDate).toLocaleDateString()
            : "N/A";
        if (selectedColumns.includes("operationDate"))
          row["Next Activity Date"] = deal.operationDate
            ? new Date(deal.operationDate).toLocaleDateString()
            : "N/A";
        return row;
      });

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

  return (
    <div className="pdstage-area">
      <div className="container-fluid">
        <div className="pdlist-row">
          <div className="table-controls">
            {/* Export to Excel Button */}
            {/* <ImportExportRoundedIcon onClick={(e:any)=>setDrawerOpen(true)}/> */}
            <Button
              variant="contained"
              onClick={(e: any) => setDrawerOpen(true)}
              disabled={selectedRows.length > 0}
              style={{ marginBottom: "16px" }}
            >
              Export
            </Button>
          </div>
          <div className="pdlisttable-scroll">
            <table className="pdlist-table">
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < dealsList.length
                      }
                      checked={
                        selectedRows.length === dealsList.length &&
                        dealsList.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th onClick={() => handleSort("stageName")}>Stage</th>
                  <th onClick={() => handleSort("treatmentName")}>
                    Treatment Name
                  </th>
                  <th onClick={() => handleSort("value")}>Value</th>
                  <th>Organisation</th>
                  <th onClick={() => handleSort("contactPersonName")}>
                    Contact Person
                  </th>
                  <th>Expected Close Date</th>
                  <th>Next Activity Date</th>
                </tr>
              </thead>
              <tbody>
                {dealsList.length > 0 ? (
                  dealsList.map((d) => (
                    <tr key={d.dealID}>
                      <td>
                        <Checkbox
                          checked={selectedRows.includes(d.dealID)}
                          onChange={() => handleRowSelection(d.dealID)}
                        />
                      </td>
                      <td>{d.stageName}</td>
                      <td>{d.treatmentName || "N/A"}</td>
                      <td>
                        {userRole === 1
                          ? d.value && !isNaN(Number(d.value))
                            ? `£${d.value}`
                            : "N/A"
                          : "£0"}
                      </td>
                      <td>{getOrganizationName(d.organizationID)}</td>
                      <td>{getContactPersonName(d.contactPersonID)}</td>
                      <td>
                        {d.expectedCloseDate
                          ? new Date(d.expectedCloseDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {d.operationDate
                          ? new Date(d.operationDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No deals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <Button onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {error && <UnAuthorized error={error as any} />}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div style={{ width: "300px", padding: "16px" }}>
          <h3>Bulk Actions</h3>
          <p>{selectedRows.length} deals selected</p>
          <br />
          <div hidden={selectedRows.length > 0}>
            <h4>PipeLines</h4>
            <MultiSelectDropdown
              list={getPipeLinesList()}
              selectedList={selectedPipeLines}
              onItemChange={(e: any) => onPipeLineSelection(e)}
            />
          </div>
          <br />
          <div style={{ margin: "16px 0" }} hidden={selectedRows.length > 0}>
            <h4>Select Columns to Export</h4>
            {allColumns.map((col) => (
              <div key={col.key}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col.key)}
                    onChange={() => toggleColumnSelection(col.key)}
                  />{" "}
                  {col.label}
                </label>
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            hidden={selectedRows.length > 0}
            onClick={handleExportToExcel}
          >
            Export All Deals to Excel
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default DealListView;
