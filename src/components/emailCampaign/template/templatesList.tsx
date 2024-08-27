import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../../common/itemCollection";
import { EmailTemplate } from "../../../models/emailTemplate";
import { EmailTemplateService } from "../../../services/emailTemplateService";
import TemplatesAddEditDialog from "./templatesAddEditDialog";

const TemplatesList = () => {
  const columnMetaData = [
    { columnName: "id", columnHeaderName: "Template ID", width: 150 },
    { columnName: "name", columnHeaderName: "Template Name", width: 200 },
    { columnName: "modifiedBy", columnHeaderName: "Last Modified By", width: 200 },
    { columnName: "modifiedDate", columnHeaderName: "Last Modified Date", width: 200 },
  ];

  return (
    <ItemCollection itemName={"Template"}
                    itemType={EmailTemplate}
                    columnMetaData={columnMetaData}
                    viewAddEditComponent={TemplatesAddEditDialog}
                    api={new EmailTemplateService(ErrorBoundary)}
                    itemsBySubURL={"GetAllTemplates"}  />
);
};

export default TemplatesList;
