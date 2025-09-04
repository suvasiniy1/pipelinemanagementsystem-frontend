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
import LockResetIcon from "@mui/icons-material/LockReset";
import moment from "moment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const UsersList = () => {
  const userSvc = new UserService(ErrorBoundary);
  const [loadingData, setLoadingData] = useState(true);
  const [isUnlockClicked, setIsUnlockClicked] = useState(false);
  const [isResetpasswordClicked, setIsResetpasswordClicked] = useState(false);
  const [actionType, setActionType] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [userItem, setUserItem] = useState<User>(new User());
  const [loadRowData, setLoadRowData] = useState(true);
  const [isResendClicked, setIsResendClicked] = useState(false);

  const columnMetaData = [
    { columnName: "firstName", columnHeaderName: "FirstName", width: 150 },
    { columnName: "lastName", columnHeaderName: "LastName", width: 150 },
    { columnName: "userName", columnHeaderName: "Username", width: 150 },
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
      userSvc.getOrganizations().catch(() => []), // Handle failure
    ])
      .then((res) => {
        LocalStorageUtil.setItemObject(
          "userRoles",
          JSON.stringify(res[0] || [])
        );
        LocalStorageUtil.setItemObject(
          "organizations",
          JSON.stringify(res[1] || [])
        );
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
    console.log(item);
    if (isResetpasswordClicked) return;
    setIsResetpasswordClicked(true);
    userSvc
      .changePassword(item.id)
      .then((res) => {
        toast.success(`Password is successfully reset for ${item.userName}. Please check your email.`);
      })
      .finally(() => {
        setIsResetpasswordClicked(false);
      });
  };
  const resendConfirmation = (row: any) => {
  if (isResendClicked) return;
  setIsResendClicked(true);
  userSvc
    .resendConfirmation(String(row.userId)) // <<< stringify
    .then(() => toast.success(`Confirmation email sent to ${row.email}.`))
    .catch((err: any) => {
      const msg = err?.response?.data || "Failed to resend confirmation email.";
      toast.error(msg);
    })
    .finally(() => setIsResendClicked(false));
};

  const customActions = (item: any) => {
     const row = item?.row;
    const userProfile = Util.UserProfile();
    const currentUserId = userProfile?.userId;
    const rowUserId = item?.row?.userId;
    const isCurrentUser = currentUserId && rowUserId && String(currentUserId) === String(rowUserId);
    const needsConfirmation =
  row?.emailConfirmed === false || row?.EmailConfirmed === false;
    return (
      <>
        <Button
          color="primary"
          startIcon={<LockResetIcon />}
          title="Reset Password"
          onClick={(event) => {
            if (!isCurrentUser) resetPassword(item.row);
          }}
          className="rowActionIcon"
          disabled={isCurrentUser}
        ></Button>
        {/* Resend confirmation – only show when not confirmed */}
      {needsConfirmation && (
        <Button
          color="primary"
          startIcon={<MailOutlineIcon />}
          title="Resend confirmation email"
          onClick={() => resendConfirmation(row)}
          className="rowActionIcon"
          disabled={isResendClicked}
        />
      )}
      </>
    );
  };

  return loadingData ? (
    <div className="alignCenter">
      <Spinner />
    </div>
  ) : (
    <>
      <ItemCollection
        itemName={"User"}
        itemType={User}
        columnMetaData={columnMetaData}
        viewAddEditComponent={UsersAddEditDialog}
        itemsBySubURL={"GetUsers"}
        rowTransformFn={rowTransform}
        api={new UserService(ErrorBoundary)}
        enableCheckboxSelection={false}
        customActions={(e: any) => customActions(e)}
        onSelectionModelChange={() => {}} 
      />
    </>
  );
};

export default UsersList;
