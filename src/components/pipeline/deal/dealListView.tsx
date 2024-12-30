import React, { useEffect, useState } from "react";
import { Deal } from "../../../models/deal";
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

type Params = {
  pipeLineId: number;
};

const DealListView = (props: Params) => {
  const [dealsList, setDealsList] = useState<Array<Deal>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const stagesSvc = new StageService(ErrorBoundary);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: "",
    direction: "asc",
  });

  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );

  const getOrganizationName = (orgId: number) =>
    utility.organizations.find((o) => o.organizationID === orgId)?.name || "N/A";

  const getContactPersonName = (personId: number | null | undefined) =>
    personId !== undefined
      ? utility.persons.find((p) => p.personID === personId)?.personName || "No Contact"
      : "No Contact";

  useEffect(() => {
    loadDeals();
  }, [currentPage]);

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

      // Special handling for contactPersonName
      if (key === "contactPersonName") {
        aValue = getContactPersonName(a.contactPersonID);
        bValue = getContactPersonName(b.contactPersonID);
      }

      if (aValue! < bValue!) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue! > bValue!) {
        return direction === "asc" ? 1 : -1;
      }
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
  const handleJustCallDialer = async () => {
    if (selectedRows.length === 0) {
        alert("Please select at least one deal.");
        return;
    }

    try {
        const selectedDeals = dealsList.filter((deal) => selectedRows.includes(deal.dealID));
        const justCallContacts = selectedDeals.map((deal) => ({
            name: deal.personName || "No Name", // Match casing exactly
            phoneNumber: deal.phone || "",      // Match casing exactly
            email: deal.email || "",            // Match casing exactly
        }));

        const response = await stagesSvc.addContactsToJustCall({ contacts: justCallContacts }); // Wrap in 'contacts'

        if (response === true) { // Expecting a boolean response
            alert("Contacts successfully added to JustCall!");
        } else {
            console.error("Failed to add contacts");
            alert("An error occurred while adding contacts to JustCall.");
        }
    } catch (error) {
        console.error("Error in JustCall Dialer:", error);
        alert("An unexpected error occurred.");
    }
};
  return (
    <div className="pdstage-area">
      <div className="container-fluid">
        <div className="pdlist-row">
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
                  <th
                    style={{ cursor: "pointer", textAlign: "left" }}
                    onClick={() => handleSort("stageName")}
                  >
                    Stage
                  </th>
                  <th
                    style={{ cursor: "pointer", textAlign: "left" }}
                    onClick={() => handleSort("treatmentName")}
                  >
                    Treatment Name
                  </th>
                  <th
                    style={{ cursor: "pointer", textAlign: "left" }}
                    onClick={() => handleSort("value")}
                  >
                    Value
                  </th>
                  <th style={{ textAlign: "left" }}>Organisation</th>
                  <th
                    style={{ cursor: "pointer", textAlign: "left" }}
                    onClick={() => handleSort("contactPersonName")}
                  >
                    Contact Person
                  </th>
                  <th style={{ textAlign: "left" }}>Expected Close Date</th>
                  <th style={{ textAlign: "left" }}>Next Activity Date</th>
                </tr>
              </thead>
              <tbody>
                {dealsList && dealsList.length > 0 ? (
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
                      <td>{d.value || "0"}</td>
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

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ width: "300px", padding: "16px" }}>
          <h3>Bulk Edit</h3>
          <p>{selectedRows.length} deals selected</p>
          <Button
            variant="contained"
            onClick={handleJustCallDialer} 
          >
            JustCall Sales Dialer
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default DealListView;
