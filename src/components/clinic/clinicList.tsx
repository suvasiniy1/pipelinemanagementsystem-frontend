import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { Clinic } from "../../models/clinic";
import { ClinicService } from "../../services/clinicService";
import ClinicAddEditDialog from "./clinicAddEditDialog";


const ClinicList = () => {
    const columnMetaData = [
        { columnName: "clinicName", columnHeaderName: "Clinic Name", width: 300 },
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

    const rowTransform = (item: Clinic) => {
        item.id = item.clinicID;
        return item;
      };
    

    return (
        <ItemCollection
        
            itemName={"Clinic"}
            canDoActions={true}
            canAdd={true}
            itemType={Clinic}
            rowTransformFn={rowTransform}
            columnMetaData={columnMetaData}
            viewAddEditComponent={ClinicAddEditDialog}
            api={new ClinicService(ErrorBoundary)}
            itemsBySubURL={"GetAllClinicDetails"}
        />
    );
};

export default ClinicList;
