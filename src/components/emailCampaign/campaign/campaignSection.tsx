import React, { useEffect, useState } from "react";
import ItemCollection from "../../../common/itemCollection";
import { ErrorBoundary } from "react-error-boundary";
import {AssetType, Campaign } from "../../../models/campaign";
import { CampaignService } from "../../../services/campaignSerivce";
import CampaignAddEditDialog from "./campaignAddEditDialog";

type params = {
  sectionType: string;
};
const CampaignSection = (props: params) => {
  const { sectionType, ...others } = props;
  const columnMetaData = [
    { columnName: "emailtemplateId", columnHeaderName: "Template ID", width: 150 },
    { columnName: "fromName", columnHeaderName: "From Name", width: 150 },
    { columnName: "fromAddress", columnHeaderName: "From Address", width: 150 },
    { columnName: "replytoaddress", columnHeaderName: "Reply to Address", width: 150 },
    { columnName: "subject", columnHeaderName: "Subject", width: 150 },
    { columnName: "status", columnHeaderName: "Status", width: 150 }
  ];

  const templateSvc = new CampaignService(ErrorBoundary);
  const [rowData, setRowData] = useState<Array<Campaign>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    
    templateSvc.getcampaignAssets().then((res) => {
        let assetTypeId = sectionType==="Assets" ? AssetType.Email : AssetType.Task;
        
        let resByType = res?.find((r:any)=>r.assetType==assetTypeId);
      setRowData(resByType?.items ?? []);
      setIsLoading(false);
    });
  };
  return (
    <ItemCollection
      itemName={sectionType}
      rowData={rowData}
      isLoading={isLoading}
      itemType={Campaign}
      columnMetaData={columnMetaData}
      viewAddEditComponent={CampaignAddEditDialog}
      onSave={(e: any) => loadData()}
      postDelete={(e: any) => loadData()}
      api={new CampaignService(ErrorBoundary)}
      canDoActions={false}
    />
  );
};

export default CampaignSection;
