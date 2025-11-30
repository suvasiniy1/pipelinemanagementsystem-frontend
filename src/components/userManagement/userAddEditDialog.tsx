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
import { InferType } from "yup";
import { useAuthContext } from "../../contexts/AuthContext";
import { TenantService } from "../../services/tenantService";

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
  const { userProfile } = useAuthContext();
  const [tenants, setTenants] = useState<Array<any>>([]);
  
  useEffect(() => {
    console.log('=== TENANT DEBUG ===');
    console.log('User profile:', userProfile);
    console.log('User profile tenant:', userProfile ? (userProfile as any).tenant : 'No profile');
    
    // Check localStorage directly
    const storedProfile = LocalStorageUtil.getItemObject('USER_PROFILE');
    console.log('Stored profile in localStorage:', storedProfile);
    
    const storedTenants = LocalStorageUtil.getItemObject('USER_TENANTS');
    console.log('Stored tenants in localStorage:', storedTenants);
    
    // Check if user profile has tenant data
    if (userProfile && (userProfile as any).tenant && Array.isArray((userProfile as any).tenant)) {
      console.log('✅ Found tenant data in user profile:', (userProfile as any).tenant);
      setTenants((userProfile as any).tenant);
    } else if (storedTenants) {
      try {
        const parsedTenants = JSON.parse(storedTenants as string);
        console.log('✅ Using tenants from localStorage:', parsedTenants);
        setTenants(parsedTenants);
      } catch (error) {
        console.error('❌ Error parsing stored tenants:', error);
        setTenants([]);
      }
    } else {
      console.log('❌ No tenant data found for user');
      setTenants([]);
    }
    console.log('=== END TENANT DEBUG ===');
  }, [userProfile]);
type UserFormValues = InferType<typeof validationSchema>;
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
      key: "Role",
      value: "id",
      elementSize: 12,
      type: ElementType.dropdown,
      options: roles,
      isRequired: true,
      sidebyItem: "Tenant",
    },
    {
      key: "Tenant",
      value: "tenantId",
      elementSize: 12,
      type: ElementType.dropdown,
      options: tenants,
      isRequired: true,
      isSideByItem: true,
    },
        {
      key: "Phone Number",
      type: ElementType.number,
      value: "phoneNumber",
      elementSize: 12,
      isRequired: true,
      isSideByItem: true,
    },
    {
      key: "Active",
      value: "isActive",
      elementSize: 12,
      type: ElementType.checkbox,
      defaultValue: true,
      isControlInNewLine: true,
    }
  ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };
const numberRequired = (msg: string) =>
  Yup.number()
    .transform((val, orig) => (orig === '' || orig === null ? undefined : val)) // <- key
    .typeError(msg)      // non-number (incl. '')
    .required(msg);      // after transform it's undefined -> required
  const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  userName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phoneNumber: Yup.string().required("Required"),
id: numberRequired("Role is required"),
isActive: Yup.boolean().notRequired(),     // ✅ this is fine
   tenantId: numberRequired("Tenant is required"),
});


const methods = useForm<UserFormValues>({
  resolver: yupResolver(validationSchema),
  defaultValues: {
    id: '',                // empty select
    tenantId: '',          // empty select
    isActive: true,
  } as any,
});


  const { handleSubmit, setValue, setError, setFocus } = methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };
const [usernameError, setUsernameError] = useState<string | undefined>();
  useEffect(() => {
    console.log('=== EDIT USER DEBUG ===');
    console.log('selectedItem:', selectedItem);
    console.log('selectedItem.organizationId:', selectedItem?.organizationId);
    
    if (selectedItem?.userId > 0) {
      // Set role
      const roleValue = roles.find((i) => i.name === selectedItem["roleName"])?.id;
      console.log('Setting role value:', roleValue);
      setValue("id" as never, roleValue as never);

      // Set tenant (from organizationId)
      console.log('Setting tenant value from organizationId:', selectedItem.organizationId);
      setValue("tenantId" as never, selectedItem.organizationId as never);
      
      // Set active status
      setValue("isActive" as never, selectedItem.isActive as never);
    }
    console.log('=== END EDIT USER DEBUG ===');
  }, [selectedItem, roles, tenants]);

  const onChange = (value: any, item: any) => {
    const field = item.value;

    // Special handling for isActive slider (should always be boolean)
    if (field === "isActive") {
      let isActiveValue = value === true || value === "true" || value === 1 || value === "1";
      setValue("isActive" as never, isActiveValue as never);
      setSelectedItem((prev: any) => ({ ...prev, isActive: isActiveValue }));
      return;
    }
    // Auto-generate username when first or last name is entered
    if (field === "firstName" || field === "lastName") {
      const firstName =
        field === "firstName"
          ? value
          : (methods.getValues() as any)["firstName"];
      const lastName =
        field === "lastName" ? value : (methods.getValues() as any)["lastName"];
      if (firstName && lastName) {
        const generatedUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
        setValue("userName" as never, generatedUsername as never);
      }
    }
     if (field === "id" || field === "tenantId") {
    // keep '' as '' so Yup shows "Required"
    const normalized = value === '' ? '' : Number(value);
    methods.setValue(field as any, normalized as any, { shouldValidate: true });
    return;
  }

  methods.setValue(field as any, value as any, { shouldValidate: true });
  };
  const getListofItemsForDropdown = (item: any) => {
    if (item.value === "id") {
      return roles.map((role) => ({
        value: role.id,
        name: role.name,
      }));
    }

    if (item.value === "tenantId") {
      console.log('Mapping tenants for dropdown:', tenants);
      return tenants.map((tenant) => ({
        value: tenant.id,
        name: tenant.name,
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
    obj.passwordHash = "test";

    // Update only editable fields
    obj.firstName = item.firstName;
    obj.lastName = item.lastName;
    obj.email = item.email;
    obj.userName = item.userName;
    obj.phoneNumber = item.phoneNumber;
    obj.isActive = selectedItem.isActive;

    obj.roleId = item.id !== null ? Number(item.id) : 0;
    obj.organizationId = item.tenantId !== null ? Number(item.tenantId) : 0; // Map tenantId to organizationId
    obj.tenantId = item.tenantId !== null ? Number(item.tenantId) : 0;
    obj.lastLogin = new Date();
    obj.createdBy = String(Util.UserProfile()?.userId);
    obj.modifiedBy = obj.userId > 0 ? String(Util.UserProfile()?.userId) : null;
    obj.Id = obj.userId ?? 0;
    obj.userId = obj.userId ?? 0;

    // Date handling
    const isValidDate = (d: any) => {
      if (!d) return false;
      const dateObj = new Date(d);
      return !isNaN(dateObj.getTime());
    };

    if (obj.userId > 0) {
      obj.createdDate = isValidDate(obj.createdDate) ? new Date(obj.createdDate) : new Date();
      obj.modifiedDate = new Date();
    } else {
      obj.createdDate = new Date();
      obj.modifiedDate = new Date();
    }

    // Add SecurityStamp and ConcurrencyStamp fields
    obj.securityStamp = obj.securityStamp || generateRandomStamp();
    obj.concurrencyStamp = obj.concurrencyStamp || generateRandomStamp();

    // ============ BACKEND API CALL ============
    const response =
      obj.Id > 0
        ? await userSvc.putItemBySubURL(obj, `${obj.Id}`)
        : await userSvc.postItem(obj);

    if (response?.Success === false || response?.success === false) {
      toast.error(response.message || "User creation failed.");
    } else {
      toast.success(`User ${obj.Id > 0 ? "updated" : "created"} successfully`);
      setLoadRowData(true);
      setDialogIsOpen(false); // ✅ Close on success only
    }

  } catch (err: any) {
  const msg =
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong.";

  // Popup
  toast.error(msg);
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
