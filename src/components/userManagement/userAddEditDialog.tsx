import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AddEditDialog } from "../../common/addEditDialog";
import Util from "../../others/util";
import { ElementType, IControl } from "../../models/iControl";
import GenerateElements from "../../common/generateElements";
import { UserService } from "../../services/UserService";
import { toast } from "react-toastify";
import { User } from "../../models/user";
import { Role } from "../../models/role";
import { Organization } from "../../models/organization";
import { ErrorBoundary } from "react-error-boundary";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import LocalStorageUtil from "../../others/LocalStorageUtil";

const UsersAddEditDialog: React.FC<any> = (props) => {
  
  const {
    header,
    onSave,
    closeDialog,
    selectedItem,
    setSelectedItem,
    dialogIsOpen,
    setDialogIsOpen,
    isReadOnly,
    setIsReadOnly,
    setLoadRowData,
    ...others
  } = props;

  const userSvc = new UserService(ErrorBoundary);
  const [roles, setRoles] = useState<Array<any>>(
    JSON.parse(LocalStorageUtil.getItemObject("userRoles") as any) ?? []
  ); // Updated structure
  const [organizations, setOrganizations] = useState<Array<any>>(
    JSON.parse(LocalStorageUtil.getItemObject("organizations") as any) ?? []
  ); // Updated structure

  // Controls for the form fields
  const controlsList: IControl[] = [
    {
      key: "Username",
      value: "userName",
      isControlInNewLine: true,
      elementSize: 12,
      isRequired: true,
    },
    {
      key: "First Name",
      value: "firstName",
      isControlInNewLine: true,
      elementSize: 12,
      isRequired: true,
    },
    {
      key: "Last Name",
      value: "lastName",
      isControlInNewLine: true,
      elementSize: 12,
      isRequired: true,
    },
    {
      key: "Email Address",
      value: "email",
      isControlInNewLine: true,
      elementSize: 12,
      isRequired: true,
    },
    {
      key: "Phone Number",
      type: ElementType.number,
      value: "phoneNumber",
      isControlInNewLine: true,
      elementSize: 12,
      isRequired: true,
    },
    {
      key: "Password",
      value: "passwordHash",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.password,
      isRequired: true,
      hidden: selectedItem?.userId > 0,
    },
    {
      key: "Confirm Password",
      value: "confirmPassword",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.password,
      hidden: selectedItem?.userId > 0,
    },
    {
      key: "Role",
      value: "id",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.dropdown,
      options: roles,
      isRequired: true, // Use roles directly
    },
    {
      key: "Is Active",
      value: "isActive",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.checkbox,
      defaultValue: true,
    },
    {
      key: "Organization",
      value: "organizationID",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.dropdown,
      options: organizations,
      isRequired: true, // Use organizations directly
    },
  ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const validationSchema = getValidationsSchema(controlsList).shape({
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("passwordHash")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const methods = useForm(formOptions);

  const { handleSubmit, setValue } = methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  useEffect(() => {
    if (selectedItem.userId > 0) {
      setValue(
        "id" as never,
        roles.find((i) => i.name === selectedItem["roleName"])?.id as never
      );
      setValue(
        "organizationID" as never,
        organizations.find((i) => i.name === selectedItem["name"])
          ?.organizationID as never
      );
    }
  }, []);

  const onChange = (value: any, item: any) => {
    if (item.value === "roleID") {
      setValue("roleID" as never, Number(value) as never);
    }
    if (item.value === "organizationID") {
      setValue("organizationID" as never, Number(value) as never);
    }
  };
  const getListofItemsForDropdown = (item: any) => {
    
    if (item.value === "id") {
      return roles.map((role) => ({
        value: role.id,
        name: role.name,
      }));
    }
    if (item.value === "organizationID") {
      return organizations.map((org) => ({
        value: org.organizationID,
        name: org.name,
      }));
    }
    return [];
  };
  const generateRandomStamp = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };
  const onSubmit = async (item: any) => {
    try {
      let obj: User = { ...selectedItem };
      obj = Util.toClassObject(obj, item);
      obj.isActive = item.isActive === "true" ? true : false;
      obj.roleId = item.id !== null ? Number(item.id) : 0;
      obj.organizationId =
        item.organizationID !== null ? Number(item.organizationID) : 0;
      obj.lastLogin = new Date();
      obj.passwordHash = selectedItem.passwordHash ?? item.passwordHash;
      obj.createdBy = String(Util.UserProfile()?.userId);
      // obj.createdBy = Util.UserProfile()?.userId;
      obj.userId = obj.userId ?? 0;
      obj.createdDate = obj.createdDate || new Date().toISOString();
      obj.modifiedDate = null as any;
      // Add SecurityStamp and ConcurrencyStamp fields
      obj.securityStamp = obj.securityStamp || generateRandomStamp(); // Placeholder function
      obj.concurrencyStamp = obj.concurrencyStamp || generateRandomStamp(); // Placeholder function

      const response =
        obj.userId > 0
          ? await userSvc.putItemBySubURL(obj, `${obj.userId}`)
          : await userSvc.postItem(obj);

      if (response) {
        toast.success(
          `User ${obj.userId > 0 ? "updated" : "created"} successfully`
        );
        setLoadRowData(true);
        setDialogIsOpen(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        `Error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header={`${selectedItem?.userId > 0 ? "Edit" : "Add"} User`}
        dialogSize={"m"}
        onSave={handleSubmit(onSubmit)}
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
      >
        {selectedItem["roleID"]}
        <div className="modelformfiledrow row">
          <div className="modelformbox ps-2 pe-2">
            <GenerateElements
              controlsList={controlsList}
              selectedItem={selectedItem}
              getListofItemsForDropdown={getListofItemsForDropdown}
              onChange={onChange}
            />
            <br />
          </div>
        </div>
      </AddEditDialog>
    </FormProvider>
  );
};

export default UsersAddEditDialog;
