import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { User } from "../../models/user";
import { UserService } from "../../services/UserService";
import UsersAddEditDialog from "../userManagement/userAddEditDialog";

const UsersList = () => {
    const columnMetaData = [
        { columnName: "userName", columnHeaderName: "Username", width: 150 },
        { columnName: "firstName", columnHeaderName: "Firstname", width: 150 },
        { columnName: "lastName", columnHeaderName: "Lastname", width: 150 },
        { columnName: "phoneNumber", columnHeaderName: "Phonenumber", width: 150 },
        { columnName: "email", columnHeaderName: "Email Address", width: 150 },
        { columnName: "name", columnHeaderName: "Organization", width: 150 },
        { columnName: "roleName", columnHeaderName: "Role", width: 150 },
        { columnName: "isActive", columnHeaderName: "Status", width: 150 },
        { columnName: "lastLogin", columnHeaderName: "Last Login", width: 150 },
    ];

    const rowTransform = (item: User, index: number) => {
        return { ...item, id: item.userId > 0 ? item.userId : index }; // Ensure a unique id
    };

    return (
        <ItemCollection
            itemName={"User"}
            itemType={User}
            columnMetaData={columnMetaData}
            viewAddEditComponent={UsersAddEditDialog}
            itemsBySubURL={"GetUsers"}
            rowTransformFn={rowTransform}
            api={new UserService(ErrorBoundary)}
            enableCheckboxSelection={false} 
        />
    );
};

export default UsersList;
