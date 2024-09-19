import React, { useState, useEffect } from 'react';
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
    const [roles, setRoles] = useState<Array<{ key: string; value: string }>>([]); // Updated structure
    const [organizations, setOrganizations] = useState<Array<{ key: string; value: string }>>([]); // Updated structure

    // Controls for the form fields
    const controlsList: IControl[] = [
        { key: "Username", value: "userName", isControlInNewLine: true, elementSize: 12 },
        { key: "First Name", value: "firstName", isControlInNewLine: true, elementSize: 12 },
        { key: "Last Name", value: "lastName", isControlInNewLine: true, elementSize: 12 },
        { key: "Email Address", value: "email", isControlInNewLine: true, elementSize: 12 },
        { key: "Phone Number", type: ElementType.number, value: "phoneNumber", isControlInNewLine: true, elementSize: 12 },
        { key: "Password", value: "passwordHash", isControlInNewLine: true, elementSize: 12, type: ElementType.password },
        { key: "Confirm Password", value: "confirmPassword", isControlInNewLine: true, elementSize: 12, type: ElementType.password },
        {
            key: "Role", value: "id", isControlInNewLine: true, elementSize: 12,
            type: ElementType.dropdown, options: roles // Use roles directly
        },
        { key: "Is Active", value: "isActive", isControlInNewLine: true, elementSize: 12, type: ElementType.checkbox, defaultValue: true },
        {
            key: "Organization", value: "organizationID", isControlInNewLine: true, elementSize: 12,
            type: ElementType.dropdown, options: organizations // Use organizations directly
        }
    ]

    // Form options without validation
    const formOptions = {
        defaultValues: {
            user: selectedItem?.userName || '',  // Add user here
            userName: selectedItem?.userName || '',
            email: selectedItem?.email || '',
            passwordHash: '',
            confirmPassword: '',
            phoneNumber: selectedItem?.phoneNumber || '',
            roleID: selectedItem?.roleID || null,
            isActive: selectedItem?.isActive ?? true,
            organizationID: selectedItem?.organizationID || null,
        },
    };

    const methods = useForm(formOptions);
    const { handleSubmit, setValue } = methods;
    useEffect(() => {
        // Fetch roles and organizations
        userSvc.getRoles().then((response) => {
            if (response && Array.isArray(response)) {
                setRoles(response.map((res: Role) => ({
                    key: res.name, // Displayed value
                    value: res.id ? res.id.toString() : ''  // Stored value
                })));
            }
        }).catch(error => {
            console.error('Error fetching roles:', error);
        });

        userSvc.getOrganizations().then((fetchedOrgs) => {
            if (fetchedOrgs && Array.isArray(fetchedOrgs)) {
                setOrganizations(fetchedOrgs.map((org: Organization) => ({
                    key: org.name, // Displayed value
                    value: org.organizationID ? org.organizationID.toString() : ''  // Stored value
                })));
            }
        }).catch(error => {
            console.error('Error fetching organizations:', error);
        });
    }, [selectedItem, setValue]);

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    };

    const onChange = (value: any, item: any) => {
        if (item.value === 'roleID') {
            setValue('roleID', Number(value));
        }
        if (item.value === 'organizationID') {
            setValue('organizationID', Number(value));
        }
    };
    const getListofItemsForDropdown = (item: any) => {
        if (item.value === 'id') {
            return roles.map(role => ({
                value: role.value,
                name: role.key
            }));
        }
        if (item.value === 'organizationID') {
            return organizations.map(org => ({
                value: org.value,
                name: org.key
            }));
        }
        return [];
    };
    const generateRandomStamp = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (Math.random() * 16) | 0,
                  v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    const onSubmit = async (item: any) => {
        try {
            let obj: User = { ...selectedItem };
            obj = Util.toClassObject(obj, item);
            obj.isActive = item.isActive;
            obj.roleId = item.id !== null ? Number(item.id) : 0;
            obj.organizationId = item.organizationID !== null ? Number(item.organizationID) : 0;
            obj.lastLogin = new Date();
            obj.createdBy = String(Util.UserProfile()?.userId); 
           // obj.createdBy = Util.UserProfile()?.userId;
            obj.userId = obj.userId ?? 0;
            obj.createdDate = obj.createdDate || new Date().toISOString();
             // Add SecurityStamp and ConcurrencyStamp fields
           obj.SecurityStamp = obj.SecurityStamp || generateRandomStamp();  // Placeholder function
           obj.ConcurrencyStamp = obj.ConcurrencyStamp || generateRandomStamp();  // Placeholder function

            const response = obj.userId > 0 
                ? await userSvc.putItemBySubURL(obj, `${obj.userId}`) 
                : await userSvc.postItem(obj);

            if (response) {
                toast.success(`User ${obj.userId > 0 ? 'updated' : 'created'} successfully`);
                setLoadRowData(true);
                setDialogIsOpen(false);
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(`Error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    return (
        <FormProvider {...methods}>
            <AddEditDialog
                dialogIsOpen={dialogIsOpen}
                header={`${selectedItem?.userId > 0 ? 'Edit' : 'Add'} User`}
                dialogSize={"m"}
                onSave={handleSubmit(onSubmit)}
                closeDialog={oncloseDialog}
                onClose={oncloseDialog}
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
