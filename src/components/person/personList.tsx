import { useEffect, useState } from "react";
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

    const personSvc = new personService(ErrorBoundary);
    const [rowData, setRowData] = useState<Array<Person>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);
        personSvc.getPersons().then((res: Array<Person>) => {
            console.log("Fetched Persons: ", res); // Log the data
            if (res) {
                const transformedData = res.map(rowTransform);
                setRowData([...transformedData]);
            }
            setIsLoading(false);
        }).catch((err) => {
            setRowData([]);
            setIsLoading(false);
        });
    };
    const rowTransform = (item: Person, index: number) => {
        return { ...item, id: item.personID > 0 ? item.personID : index }; // Ensure a unique id
    };

    return (
        <ItemCollection
            itemName={"Person"}
            rowData={rowData}
            isLoading={isLoading}
            itemType={Person}
            columnMetaData={columnMetaData}
            viewAddEditComponent={PersonAddEditDialog}
            onSave={(e: any) => loadData()}
            postDelete={(e: any) => loadData()}
            api={new personService(ErrorBoundary)}
        />
    );
};

export default PersonList;
