import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../../common/itemCollection";
import { EmailConfiguration } from "../../../models/emailConfiguration";
import { EmailConfigurationService } from "../../../services/emailConfigurationService";
import EmailConfigurationAddEditDialog from "./emailConfigurationAddEditDialog";

const EmailConfigurationList = () => {
  const columnMetaData = [
    { columnName: "id", columnHeaderName: "ID", width: 150 },
    { columnName: "emailtemplateId", columnHeaderName: "Template ID", width: 150 },
    { columnName: "fromName", columnHeaderName: "From Name", width: 150 },
    { columnName: "fromAddress", columnHeaderName: "From Address", width: 150 },
    { columnName: "replytoaddress", columnHeaderName: "Reply to Address", width: 150 },
    { columnName: "subject", columnHeaderName: "Subject", width: 150 },
    { columnName: "status", columnHeaderName: "Status", width: 150 }
  ];

  const emailConfigSvc = new EmailConfigurationService(ErrorBoundary);
  const [rowData, setRowData] = useState<Array<EmailConfiguration>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    emailConfigSvc
      .getEmailConfigurations()
      .then((res: Array<EmailConfiguration>) => {
        
        if (res) {
          res.forEach((r) => {
            r = rowTransform(r);
          });
          setRowData([...res]);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setRowData([]);
        setIsLoading(false);
      });
  };

  const rowTransform = (item: EmailConfiguration) => {
    return item;
  };

  return (
    <ItemCollection
      itemName={"EmailConfiguration"}
      rowData={rowData}
      isLoading={isLoading}
      itemType={EmailConfiguration}
      columnMetaData={columnMetaData}
      viewAddEditComponent={EmailConfigurationAddEditDialog}
      onSave={(e: any) => loadData()}
      postDelete={(e: any) => loadData()}
      api={new EmailConfigurationService(ErrorBoundary)}
    />
  );
};

export default EmailConfigurationList;
