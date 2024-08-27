import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { Person } from "../../models/person";
import { personService } from "../../services/personService";
import PersonAddEditDialog from "../person/personAddEditDialog";


const PersonList = () => {
    const columnMetaData = [
        { columnName: "personName", columnHeaderName: "Personname", width: 150 },
        { columnName: "phone", columnHeaderName: "Phone", width: 150 },
        { columnName: "email", columnHeaderName: "Email", width: 150 },
        { columnName: "firstName", columnHeaderName: "Firstname", width: 150 },
        { columnName: "lastName", columnHeaderName: "Lastname", width: 150 },
        { columnName: "name", columnHeaderName: "Organization", width: 150 },
        { columnName: "labelName", columnHeaderName: "Label", width: 150 },
        { columnName: "userName", columnHeaderName: "Username", width: 150 },
        { columnName: "sourceName", columnHeaderName: "Source", width: 150 },
    ];

    return (
        <ItemCollection
            itemName={"Person"}
            itemType={Person}
            columnMetaData={columnMetaData}
            viewAddEditComponent={PersonAddEditDialog}
            itemsBySubURL={"GetAllPersonDetails"}
            api={new personService(ErrorBoundary)}
        />
    );
};

export default PersonList;
