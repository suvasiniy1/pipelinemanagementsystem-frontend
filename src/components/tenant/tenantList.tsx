import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { Tenant } from "../../models/tenant";
import { TenantService } from "../../services/tenantService";
import TenantDialog from "./tenantDialog";
import React from "react";
import { getThemeById } from "../../others/themes";

const TenantList = () => {
    const columnMetaData = [
        { columnName: "name", columnHeaderName: "Tenant Name", width: 200 },
        { 
            columnName: "isActive", 
            columnHeaderName: "Status", 
            width: 100,
            renderCell: (params: any) => (
                <span style={{ color: params.value === 'Active' ? '#28a745' : '#dc3545' }}>
                    {params.value}
                </span>
            )
        },
        { columnName: "themeId", columnHeaderName: "Theme", width: 120 },
        { columnName: "logo", columnHeaderName: "Logo", width: 100 },
        { columnName: "smtpUsername", columnHeaderName: "SMTP Username", width: 200 },
        { columnName: "port", columnHeaderName: "Port", width: 80 },
        {
            columnName: "modifiedDate",
            columnHeaderName: "Last Modified Date",
            width: 150,
        },
    ];

    const rowTransform = (item: Tenant) => {
        const theme = getThemeById(item.themeId || 'default');
        return {
            ...item,
            isActive: item.isActive ? 'Active' : 'Inactive',
            themeId: theme?.displayName || 'Default Blue'
        };
    };

    return (
        <ItemCollection
            itemName={"Tenant"}
            canDoActions={true}
            canAdd={true}
            itemType={Tenant}
            rowTransformFn={rowTransform}
            columnMetaData={columnMetaData}
            viewAddEditComponent={TenantDialog}
            api={new TenantService()}
        />
    );
};

export default TenantList;