import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { User } from "../../models/user";
import { UserService } from "../../services/UserService";
import UsersAddEditDialog from "../userManagement/userAddEditDialog";
import { useEffect, useState } from "react";
import Util from "../../others/util";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import { Spinner } from "react-bootstrap";

const UsersList = () => {
  const userSvc = new UserService(ErrorBoundary);
  const [loadingData, setLoadingData] = useState(true);

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

  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      userSvc.getRoles().catch(() => []), // If API fails, return an empty array
      userSvc.getOrganizations().catch(() => []) // Handle failure
    ])
      .then((res) => {
        LocalStorageUtil.setItemObject("userRoles", JSON.stringify(res[0] || []));
        LocalStorageUtil.setItemObject("organizations", JSON.stringify(res[1] || []));
      })
      .catch((error) => {
        console.error("Error fetching roles or organizations:", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, []);
  

  const rowTransform = (item: User, index: number) => {
    return {
      ...item,
      roleId: item.roleId,
      organizationId: item.organizationId,
      id: item.userId > 0 ? item.userId : index,
    }; // Ensure a unique id
  };

  return loadingData ? (
    <div className="alignCenter">
      <Spinner />
    </div>
  ) : (
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
