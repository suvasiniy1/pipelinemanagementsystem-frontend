import React, { useEffect, useState } from "react";
import { Deal } from "../../../../../models/deal";
import { Accordion, Spinner } from "react-bootstrap";
import DealActivityDetails from "./dealLogDetails";
import { DealAuditLogService } from "../../../../../services/dealAuditLogService";
import { ErrorBoundary } from "react-error-boundary";
import { DealAuditLog } from "../../../../../models/dealAutidLog";

type params = {
  dealItem: Deal;
};

const DealLogsList = (props: params) => {
  const dealAuditLogSvc = new DealAuditLogService(ErrorBoundary);
  const [dealAuditLogsList, setDealAuditLogsList] = useState<
    Array<DealAuditLog>
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dealAuditLogSvc
      .getDealLogs(2) //hardcoded for temporarly due to issue http://20.26.122.140/PLMS/api/Deal/2
      .then((res) => {
        setDealAuditLogsList(res ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <>
          <h3>Recent Activites </h3>
          <div
            className="activityfilter-accrow  mb-3"
            hidden={dealAuditLogsList.length == 0}
          >
            <Accordion className="activityfilter-acco">
              {dealAuditLogsList.map((audit, index) => (
                <DealActivityDetails
                  log={audit}
                  index={index}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={(e: any) => {
                    setSelectedIndex(e);
                  }}
                />
              ))}
            </Accordion>
          </div>
          <div hidden={dealAuditLogsList.length > 0}>
            No recent activites to show against to selected deal
          </div>
        </>
      )}
    </>
  );
};

export default DealLogsList;
