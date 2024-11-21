import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { Source } from "../../models/source";
import { SourceService } from "../../services/sourceService";
import SourceAddEditDialog from "./sourceAddEditDialog";


const SourceList = () => {
    const columnMetaData = [
        { columnName: "sourceName", columnHeaderName: "Source Name", width: 300 },
        {
            columnName: "modifiedBy",
            columnHeaderName: "Last Modified By",
            width: 150,
          },
          {
            columnName: "modifiedDate",
            columnHeaderName: "Last Modified Date",
            width: 150,
          },
    ];

    const rowTransform = (item: Source) => {
        item.id = item.sourceID;
        return item;
      };
    

    return (
        <ItemCollection
        
            itemName={"Source"}
            canDoActions={true}
            canAdd={true}
            itemType={Source}
            rowTransformFn={rowTransform}
            columnMetaData={columnMetaData}
            viewAddEditComponent={SourceAddEditDialog}
            api={new SourceService(ErrorBoundary)}
            itemsBySubURL={"GetAllSourceDetails"}
        />
    );
};

export default SourceList;
