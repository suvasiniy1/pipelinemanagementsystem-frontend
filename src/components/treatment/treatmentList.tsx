import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { Treatment } from "../../models/treatment";
import { TreatmentService } from "../../services/treatmenetService";
import TreatmentAddEditDialog from "./treatmentAddEditDialog";


const TreatMentList = () => {
    const columnMetaData = [
        { columnName: "treatmentName", columnHeaderName: "Treatment Name", width: 300 },
        { columnName: "category", columnHeaderName: "Category", width: 300 },
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

    const rowTransform = (item: Treatment) => {
        item.id = item.treatmentID;
        return item;
      };
    

    return (
        <ItemCollection
        
            itemName={"Treatment"}
            canDoActions={true}
            canAdd={true}
            itemType={Treatment}
            rowTransformFn={rowTransform}
            columnMetaData={columnMetaData}
            viewAddEditComponent={TreatmentAddEditDialog}
            api={new TreatmentService(ErrorBoundary)}
            itemsBySubURL={"GetAllTreatmentDetails"}
        />
    );
};

export default TreatMentList;
