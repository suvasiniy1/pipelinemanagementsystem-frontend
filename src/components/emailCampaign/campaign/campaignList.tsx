import React, { useEffect, useState } from "react";
import ItemCollection from "../../../common/itemCollection";
import { ErrorBoundary } from "react-error-boundary";
import { Campaign } from "../../../models/campaign";
import { CampaignService } from "../../../services/campaignSerivce";
import CampaignAddEditDialog from "./campaignAddEditDialog";

const CampaignList = () => {
  const columnMetaData = [
    { columnName: "id", columnHeaderName: "Campaign ID", width: 100 },
    { columnName: "name", columnHeaderName: "Name", width: 150 },
    { columnName: "owner", columnHeaderName: "Owner", width: 150 },
    { columnName: "startDate", columnHeaderName: "Start Date", width: 100 },
    { columnName: "endDate", columnHeaderName: "End Date", width: 100 },
    {
      columnName: "updatedBy",
      columnHeaderName: "Last Modified By",
      width: 150,
    },
    {
      columnName: "updatedDate",
      columnHeaderName: "Last Modified Date",
      width: 150,
    },
  ];

  const rowTransform = (item: Campaign) => {
    return {
      ...item,
      renderRowWithLink: [
        { key: "name", val: `/CampaignDetails?id=${item.id}` },
      ],
    };
  };

  return (
    <ItemCollection
      itemName={"Campaign"}
      itemType={Campaign}
      columnMetaData={columnMetaData}
      viewAddEditComponent={CampaignAddEditDialog}
      rowTransformFn={rowTransform}
      api={new CampaignService(ErrorBoundary)}
    />
  );
};

export default CampaignList;
