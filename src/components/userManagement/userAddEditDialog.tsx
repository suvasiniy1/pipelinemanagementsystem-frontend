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
    const [roles, setRoles] = useState<Array<{ key: string; value: string }>>([]);
    const [organizations, setOrganizations] = useState<Array<{ key: string; value: string }>>([]);
    const isEditing = !!selectedItem?.userId; 
    // ✅ Define form fields
    const controlsList: IControl[] = [
        { key: "Username", value: "userName", isControlInNewLine: true, elementSize: 12 },
        { key: "First Name", value: "firstName", isControlInNewLine: true, elementSize: 12 },
        { key: "Last Name", value: "lastName", isControlInNewLine: true, elementSize: 12 },
        { key: "Email Address", value: "email", isControlInNewLine: true, elementSize: 12 },
        { key: "Phone Number", type: ElementType.number, value: "phoneNumber", isControlInNewLine: true, elementSize: 12 },
        {
            key: "Password",
            value: "passwordHash",
            isControlInNewLine: true,
            elementSize: 12,
            type: ElementType.password,
            defaultValue: isEditing ? "" : "",  
           // autoComplete: "new-password",  
           // readOnly: isEditing, 
           // title: "",  
           // style: { pointerEvents: "none" }, 
            disabled: true,
        },        
        {
            key: "Confirm Password",
            value: "confirmPassword",
            isControlInNewLine: true,
            elementSize: 12,
            type: ElementType.password,
            defaultValue: isEditing ? "******" : "",  // ✅ Show masked value like Password
            disabled: isEditing,  // ✅ Disable field when editing
        },
        
        
        { key: "Role", value: "roleID", isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: roles },
        { key: "Is Active", value: "isActive", isControlInNewLine: true, elementSize: 12, type: ElementType.checkbox, defaultValue: true },
        { key: "Organization", value: "organizationID", isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: organizations },
    ];

    // ✅ Form default values
    const formOptions = {
        defaultValues: {
            userName: selectedItem?.userName || '',
            email: selectedItem?.email || '',
            passwordHash: isEditing ? "******" : '',
            confirmPassword: '',
            phoneNumber: selectedItem?.phoneNumber || '',
            roleID: selectedItem?.roleID ? selectedItem.roleID.toString() : '',
            isActive: selectedItem?.isActive ?? true,
            organizationID: selectedItem?.organizationID ? selectedItem.organizationID.toString() : '',
        },
    };

    const methods = useForm(formOptions);
    const { handleSubmit, setValue } = methods;
    useEffect(() => {
        if (isEditing && selectedItem?.passwordHash) {
            setValue("passwordHash", "******");  // ✅ Always show masked value in edit mode
        }
    }, [selectedItem, setValue]);
    
    useEffect(() => {
        console.log("Selected Organization ID:", selectedItem?.organizationID);
        console.log("Fetched Organizations:", organizations);
    }, [organizations, selectedItem]);
    

    // ✅ Fetch roles and organizations only once
    useEffect(() => {
        if (roles.length === 0) {
            userSvc.getRoles().then((response) => {
                console.log("Fetched Roles:", response);
                if (response && Array.isArray(response)) {
                    const formattedRoles = response.map((res: Role) => ({
                        key: res.name,
                        value: res.id.toString(),
                    }));
                    setRoles(formattedRoles);
                }
            }).catch(error => console.error("Error fetching roles:", error));
        }

        if (organizations.length === 0) {
            userSvc.getOrganizations().then((fetchedOrgs) => {
                console.log("Fetched Organizations:", fetchedOrgs);
                if (fetchedOrgs && Array.isArray(fetchedOrgs)) {
                    const formattedOrganizations = fetchedOrgs.map((org: Organization) => ({
                        key: org.name,
                        value: org.organizationID.toString(),
                    }));
                    setOrganizations(formattedOrganizations);
                }
            }).catch(error => console.error("Error fetching organizations:", error));
        }
    }, []);

    // ✅ Set roleID only after roles are available
    useEffect(() => {
        if (roles.length > 0 && selectedItem?.roleName) {
            const matchingRole = roles.find(role => role.key === selectedItem.roleName);
            if (matchingRole) {
                console.log("Setting Role ID:", matchingRole.value);
                setValue("roleID", matchingRole.value, { shouldValidate: true });
            } else {
                console.warn("No matching role found for:", selectedItem.roleName);
            }
        }
    }, [roles, selectedItem, setValue]);

    // ✅ Set organizationID only after organizations are available
    useEffect(() => {
        if (organizations.length > 0 && selectedItem?.name) {
            const matchingOrg = organizations.find(org => org.key === selectedItem.name);
            if (matchingOrg) {
                console.log("Setting Organization ID:", matchingOrg.value);
                setValue("organizationID", matchingOrg.value, { shouldValidate: true });
            } else {
                console.warn("No matching organization found for:", selectedItem.name);
            }
        }
    }, [organizations, selectedItem, setValue]);
    // ✅ Handle dropdown change
    const onChange = (value: any, item: any) => {
        console.log(`Dropdown Changed - ${item.value}:`, value);
        setValue(item.value, value, { shouldValidate: true });
    };

    // ✅ Generate dropdown list
    const getListofItemsForDropdown = (item: any) => {
        if (item.value === "roleID") {
            return roles.map(role => ({ value: role.value, name: role.key }));
        }
        if (item.value === "organizationID") {
            return organizations.map(org => ({ value: org.value.toString(), name: org.key }));
        }
        return [];
    };

    // ✅ Form submission
    const onSubmit = async (item: any) => {
        try {
            let obj: User = { ...selectedItem, ...item };
            obj.isActive = item.isActive;
            obj.roleId = item.roleID ? Number(item.roleID) : 0;
            obj.organizationId = item.organizationID ? Number(item.organizationID) : 0;
            obj.lastLogin = new Date();
            obj.createdBy = String(Util.UserProfile()?.userId);
            obj.Id = obj.userId ?? selectedItem?.userId ?? 0;  
            obj.userId = obj.userId ?? 0;
            // Ensure essential identity fields are maintained
        obj.emailConfirmed = selectedItem?.emailConfirmed ?? true; // Keep it true if previously confirmed
        obj.twoFactorEnabled = selectedItem?.twoFactorEnabled ?? false; // Preserve existing 2FA setting
        obj.securityStamp = selectedItem?.securityStamp ?? ""; // Maintain security stamp
        obj.concurrencyStamp = selectedItem?.concurrencyStamp ?? ""; // Maintain concurrency stamp
        obj.normalizedEmail = item.email?.toUpperCase() || selectedItem?.normalizedEmail || "";
        obj.normalizedUserName = item.userName?.toUpperCase() || selectedItem?.normalizedUserName || "";

            if (obj.userId > 0) {
                // ✅ If updating, keep existing password
                obj.modifiedDate = new Date();
                if (!item.passwordHash || item.passwordHash === "******") {
                    obj.passwordHash = selectedItem.passwordHash;  // ✅ Retain encrypted password
                }
            } else {
                // ✅ If creating, require password
                obj.createdDate = obj.createdDate ? new Date(obj.createdDate) : new Date();
                if (!obj.passwordHash) {
                    toast.error("Password is required for new users!");
                    return;
                }
            }
    
            console.log("Submitting User Data:", obj);
            const response = obj.userId > 0
                ? await userSvc.putItemBySubURL(obj, `${obj.userId}`)
                : await userSvc.postItem(obj);

            if (response) {
                toast.success(`User ${obj.userId > 0 ? "updated" : "created"} successfully`);
                setLoadRowData(true);
                setDialogIsOpen(false);
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error(`Error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    return (
        <FormProvider {...methods}>
            <AddEditDialog
                dialogIsOpen={dialogIsOpen}
                header={`${selectedItem?.userId > 0 ? "Edit" : "Add"} User`}
                dialogSize={"m"}
                onSave={handleSubmit(onSubmit)}
                closeDialog={() => setDialogIsOpen(false)}
            >
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
