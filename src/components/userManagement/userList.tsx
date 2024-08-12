import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { User } from "../../models/user";
import { UserService } from "../../services/UserService";
import UsersAddEditDialog from "../userManagement/userAddEditDialog";

const UsersList = () => {
    const columnMetaData = [
        { columnName: "userName", columnHeaderName: "Username", width: 150 },
        { columnName: "email", columnHeaderName: "Email Address", width: 150 },
        { columnName: "isActive", columnHeaderName: "Status", width: 150 },
        { columnName: "role", columnHeaderName: "Role", width: 150 },
        { columnName: "lastLogin", columnHeaderName: "Last Login", width: 150 },
        { columnName: "visibilityGroupName", columnHeaderName: "Visibility Group", width: 150 },
    ];

    const userSvc = new UserService(ErrorBoundary);
    const [rowData, setRowData] = useState<Array<User>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);
        userSvc
            .getUsers()
            .then((res: Array<User>) => {
                if (res) {
                    const transformedData = res.map(rowTransform);
                    setRowData([...transformedData]);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                setRowData([]);
                setIsLoading(false);
            });
    };

    const rowTransform = (item: User) => {
        return { ...item, id: item.userId}; // Ensure each item has an 'id' property
    };

    return (
        <ItemCollection
            itemName={"User"}
            rowData={rowData}
            isLoading={isLoading}
            itemType={User}
            columnMetaData={columnMetaData}
            viewAddEditComponent={UsersAddEditDialog}
            onSave={(e: any) => loadData()}
            postDelete={(e: any) => loadData()}
            api={new UserService(ErrorBoundary)}
        />
    );
};

export default UsersList;
