import React, { useEffect, useState } from "react";
import Table from "../../../common/table";
import ItemCollection from "../../../common/itemCollection";
import TemplatesAddEditDialog from "./templatesAddEditDialog";
import { EmailTemplate } from "../../../models/emailTemplate";
import { EmailTemplateService } from "../../../services/emailTemplateService";
import { ErrorBoundary } from "react-error-boundary";

const TemplatesList = () => {
  const columnMetaData = [
    { columnName: "id", columnHeaderName: "Template ID", width: 150 },
    { columnName: "name", columnHeaderName: "Template Name", width: 200 },
    { columnName: "updatedBy", columnHeaderName: "Last Modified By", width: 200 },
    { columnName: "updatedDate", columnHeaderName: "Last Modified Date", width: 200 },
  ];

  const templateSvc = new EmailTemplateService(ErrorBoundary);
  const [rowData, setRowData]=useState<Array<EmailTemplate>>([]);
  const [isLoading, setIsLoading]=useState(true);

  useEffect(()=>{
    loadData();
  },[])

  const loadData=()=>{
    setIsLoading(true);
    templateSvc.getEmailTemplates().then(res=>{
      
      setRowData(res);
      setIsLoading(false);
    })
  }

  return (
    <ItemCollection itemName={"Template"}
                    rowData={rowData}
                    isLoading={isLoading}
                    itemType={EmailTemplate}
                    columnMetaData={columnMetaData}
                    viewAddEditComponent={TemplatesAddEditDialog}
                    onSave={(e:any)=>loadData()}
                    postDelete={(e:any)=>loadData()}
                    api={new EmailTemplateService(ErrorBoundary)}  />
);
};

export default TemplatesList;
