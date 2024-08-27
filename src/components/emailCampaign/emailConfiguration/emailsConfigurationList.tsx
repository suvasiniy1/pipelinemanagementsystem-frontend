import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../../common/itemCollection";
import { EmailConfiguration } from "../../../models/emailConfiguration";
import { EmailConfigurationService } from "../../../services/emailConfigurationService";
import EmailConfigurationAddEditDialog from "./emailConfigurationAddEditDialog";

const EmailConfigurationList = () => {
  const columnMetaData = [
    { columnName: "id", columnHeaderName: "ID", width: 50 },
    { columnName: "emailtemplateId", columnHeaderName: "Template ID", width: 100 },
    { columnName: "fromName", columnHeaderName: "From Name", width: 100 },
    { columnName: "fromAddress", columnHeaderName: "From Address", width: 100 },
    { columnName: "replytoaddress", columnHeaderName: "Reply to Address", width: 100 },
    { columnName: "subject", columnHeaderName: "Subject", width: 100 },
    { columnName: "status", columnHeaderName: "Status", width: 100 },
    {
      columnName: "modifiedBy",
      columnHeaderName: "Last Modified By",
      width: 100,
    },
    {
      columnName: "modifiedDate",
      columnHeaderName: "Last Modified Date",
      width: 100,
    },
  ];

  return (
    <ItemCollection
      itemName={"EmailConfiguration"}
      itemType={EmailConfiguration}
      columnMetaData={columnMetaData}
      viewAddEditComponent={EmailConfigurationAddEditDialog}
      api={new EmailConfigurationService(ErrorBoundary)}
      itemsBySubURL={"GetAll"}
    />
  );
};

export default EmailConfigurationList;
