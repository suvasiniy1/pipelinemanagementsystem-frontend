import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { User } from "../../models/user";
import { UserService } from "../../services/UserService";
import UsersAddEditDialog from "../userManagement/userAddEditDialog";
import { useEffect, useState } from "react";
import Util from "../../others/util";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import { Spinner } from "react-bootstrap";
import { Button, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import ResetIcon from "../../resources/images/ResetIcon.svg";
import UnlockIcon from "../../resources/images/UnlockIcon.svg";

const UsersList = () => {
  const userSvc = new UserService(ErrorBoundary);
  const [loadingData, setLoadingData] = useState(true);
  const [isUnlockClicked, setIsUnlockClicked] = useState(false);
  const [isResetpasswordClicked, setIsResetpasswordClicked] = useState(false);
  const [actionType, setActionType] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [userItem, setUserItem] = useState<User>(new User());
  const [loadRowData, setLoadRowData] = useState(true);
  
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

  const unLockUserAccount = (item: User) => {
    setActionType("Unlock");
    if (isUnlockClicked) return;
    setIsUnlockClicked(true);
    userSvc
      .postItemBySubURL(item, "UnlockUserAccount", false, true)
      .then((res) => {
        setIsUnlockClicked(false);
        if (res) {
          toast.success(
            `'${item.name}'  user acount has been successfully unlocked`,
            { autoClose: 3000 }
          );
          setLoadRowData(true);
        }
      })
      .catch((err: any) => {
        setIsUnlockClicked(false);
        toast.error(
          `There is an issue with unlocking '${item.userName}' user acount, please verify...!`,
          { autoClose: 3000 }
        );
      });
  };

  const resetPassword = (item: any) => {
    // if(item.id==authContext.id){
    //   setShowDeleteDialog(true);
    //   return;
    console.log(item);
    if (isResetpasswordClicked) return;
    setIsResetpasswordClicked(true);
    setDialogIsOpen(true);
    setUserItem(item);
  };

  const customActions = (item: any) => {
    // return authContext.isTenantUser || authContext.isSuperAdmin || authContext.isEnterpriseAdmin? <>

    return (
      <>
        <Button
          color="primary"
          startIcon={
            <img
              src={ResetIcon}
              alt="0"
              height="14"
              style={{ marginLeft: "5px" }}
            />
          }
          title="Reset Password"
          onClick={(event) => {
            resetPassword(item.row);
          }}
          className="rowActionIcon"
        ></Button>

        <Button
          color="primary"
          startIcon={
            <img
              src={UnlockIcon}
              alt="0"
              height="14"
              style={{ marginLeft: "5px" }}
            />
          }
          onClick={(event) => {
            unLockUserAccount(item.row);
          }}
          title="Unlock"
          disabled={item.row.failedAuthCount != 3}
          className="rowActionIcon"
        ></Button>
      </>
    );
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
      // customActions={(e: any) => customActions(e)}
    />
  );
};

export default UsersList;
