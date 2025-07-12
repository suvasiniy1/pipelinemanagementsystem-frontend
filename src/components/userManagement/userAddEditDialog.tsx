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
      key: "First Name",
      value: "firstName",
      elementSize: 12,
      isRequired: true,
      sidebyItem: "Last Name",
    },
    {
      key: "Last Name",
      value: "lastName",
      elementSize: 12,
      isRequired: true,
      isSideByItem: true,
    },
    {
      key: "Username",
      value: "userName",
      elementSize: 12,
      isRequired: true,
      sidebyItem: "Email Address",
    },
    {
      key: "Email Address",
      value: "email",
      elementSize: 12,
      isRequired: true,
      isSideByItem: true,
    },
    {
      key: "Phone Number",
      type: ElementType.number,
      value: "phoneNumber",
      elementSize: 12,
      isRequired: true,
      sidebyItem: "Role",
    },
    {
      key: "Role",
      value: "id",
      elementSize: 12,
      type: ElementType.dropdown,
      options: roles,
      isRequired: true,
      isSideByItem: true, // Use roles directly
    },
    {
      key: "Is Active",
      value: "isActive",
      elementSize: 12,
      type: ElementType.slider,
      defaultValue: true,
      sidebyItem: "Organization",
    },
    {
      key: "Organization",
      value: "organizationID",
      elementSize: 12,
      type: ElementType.dropdown,
      options: organizations,
      isRequired: true, // Use organizations directly
      isSideByItem: true,
    },
  ];
  

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const validationSchema = getValidationsSchema(controlsList);

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
    setValue("isActive" as never, selectedItem.isActive as never);
    }
  }, []);

  const onChange = (value: any, item: any) => {
     const field = item.value;

  // Set the value normally
  setValue(field as never, value as never);

  // Auto-generate username when first or last name is entered
  if (field === "firstName" || field === "lastName") {
    const firstName = field === "firstName" ? value : (methods.getValues() as any)["firstName"];
    const lastName = field === "lastName" ? value : (methods.getValues() as any)["lastName"];
    if (firstName && lastName) {
      const generatedUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      setValue("userName" as never, generatedUsername as never);
    }
  }
    if (item.value === "roleID") {
      setValue("roleID" as never, Number(value) as never);
    }
    if (item.value === "organizationID") {
      setValue("organizationID" as never, Number(value) as never);
    }
    else{
      setValue(item.value as never, value as never);
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
      obj.passwordHash="test";
    //  obj.isActive = item.isActive === "true" ? true : false;

 // Update only editable fields
 obj.firstName = item.firstName;
 obj.lastName = item.lastName;
 obj.email = item.email;
 obj.userName = item.userName;
 obj.phoneNumber = item.phoneNumber;
 obj.isActive = item.isActive === "true" || item.isActive === true;



      obj.roleId = item.id !== null ? Number(item.id) : 0;
      obj.organizationId =
        item.organizationID !== null ? Number(item.organizationID) : 0;
      obj.lastLogin = new Date();
      obj.createdBy = String(Util.UserProfile()?.userId);
      obj.modifiedBy = obj.userId > 0 ? String(Util.UserProfile()?.userId) : null;
      // obj.createdBy = Util.UserProfile()?.userId;
      obj.Id = obj.userId ?? 0; 
      obj.userId = obj.userId ?? 0;
      obj.createdDate = obj.createdDate
  ? new Date(obj.createdDate)
  : new Date();
      obj.modifiedDate = null as any;
      // Add SecurityStamp and ConcurrencyStamp fields
      obj.securityStamp = obj.securityStamp || generateRandomStamp(); // Placeholder function
      obj.concurrencyStamp = obj.concurrencyStamp || generateRandomStamp(); // Placeholder function

      const response =
        obj.Id > 0
          ? await userSvc.putItemBySubURL(obj, `${obj.Id}`)
          : await userSvc.postItem(obj);

      if (response) {
        toast.success(
          `User ${obj.Id > 0 ? "updated" : "created"} successfully`
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
