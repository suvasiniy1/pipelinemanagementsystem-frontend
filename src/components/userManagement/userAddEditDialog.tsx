import React, { useState, useEffect } from 'react';
import { ViewEditProps } from "../../common/table";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { AddEditDialog } from "../../common/addEditDialog";
import Util from "../../others/util";
import * as Yup from "yup";
import { ElementType, IControl } from "../../models/iControl";
import GenerateElements from "../../common/generateElements";
import { UserService } from "../../services/UserService";
import { ErrorBoundary } from "react-error-boundary";
import { User } from "../../models/user";
import { toast } from "react-toastify";
import { VisibilityGroup } from "../../models/visibilityGroup";
import { UserFormValues } from '../../models/userFormValues';
import { Role } from "../../models/role";
import { Organization } from "../../models/organization";

const UsersAddEditDialog: React.FC<ViewEditProps> = (props) => {
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
    const [roles, setRoles] = useState<Array<{ name: string; value: string }>>([]);
    const [organizations, setOrganizations] = useState<Array<{ name: string; value: string }>>([]);

    const getValidationsSchema = () => {
        return Yup.object().shape({
            userName: Yup.string().required('Username is required'),
            email: Yup.string().required('Email is required').email('Email is not valid'),
            passwordHash: Yup.string().required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('passwordHash')], 'Passwords must match')
                .required('Confirm Password is required'),
            phoneNumber: Yup.string().required('Phone Number is required')
                .matches(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/, 'Please enter a valid phone number'),
            roleID: Yup.number()
                .typeError('Role must be selected')
                .required('Role is required'),
            isActive: Yup.boolean().required("Active status is required"),
            organizationID: Yup.number()
                .typeError('Organization must be selected')
                .required('Organization must be selected'),
        });
    };

    const controlsList: IControl[] = [
        { key: "Username", value: "userName", isRequired: true, isControlInNewLine: true, elementSize: 12 },
        { key: "First Name", value: "firstName", isRequired: true, isControlInNewLine: true, elementSize: 12 },
        { key: "Last Name", value: "lastName", isRequired: true, isControlInNewLine: true, elementSize: 12 },
        { key: "Email Address", value: "email", isRequired: true, isControlInNewLine: true, elementSize: 12, regex1: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errMsg1: "Please enter a valid email address" },
        { key: "Phone Number", type: ElementType.number, value: "phoneNumber", isRequired: true, isControlInNewLine: true, elementSize: 12, regex1: /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/, errMsg1: "Please enter a valid phone number" },
        { key: "Password", value: "passwordHash", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.password },
        { key: "Confirm Password", value: "confirmPassword", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.password },
        { key: "Role", value: "roleID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: roles.map(role => ({ key: role.name, value: role.value })) },
        { key: "Is Active", value: "isActive", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.checkbox, defaultValue: true },
        { key: "Organization", value: "organizationID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: organizations.map(org => ({ key: org.name, value: org.value })) }
    ];

    const formOptions = {
        resolver: yupResolver(getValidationsSchema()),
        defaultValues: {
            userName: selectedItem?.userName || '',
            email: selectedItem?.email || '',
            passwordHash: '',
            confirmPassword: '',
            phoneNumber: selectedItem?.phoneNumber || '',
            roleID: selectedItem?.roleID ? selectedItem.roleID.toString() : '',
            isActive: selectedItem?.isActive ?? true,
            organizationID: selectedItem?.organizationId ? selectedItem.organizationId.toString() : '',
            
        },
    };

    const methods = useForm<UserFormValues>(formOptions);
    const { handleSubmit, setValue } = methods;
    const { errors } = methods.formState;
    console.log('Validation errors:', errors);

    useEffect(() => {
        console.log('SelectedItem changed:', selectedItem); // Debug log
        userSvc.getRoles().then((response) => {
            console.log('Fetched roles:', response); // Debug log
            if (response && Array.isArray(response) && response.length > 0) {
                const resOptions = response.map((res: Role) => ({
                    value: res.roleId ? res.roleId.toString() : '',
                    name: res.roleName,
                }));
                setRoles(resOptions);
                if (selectedItem?.roleID) {
                    console.log('Setting roleID value:', selectedItem.roleID); // Debug log
                    setValue('roleID', selectedItem.roleID.toString());
                }
            } else {
                console.warn('No roles fetched from the API');
            }
        }).catch(error => {
            console.error('Error fetching roles:', error);
        });
    
        userSvc.getOrganizations().then((fetchedOrgs) => {
            console.log('Fetched organizations:', fetchedOrgs); // Debug log
            if (fetchedOrgs && fetchedOrgs.length > 0) {
                const orgOptions = fetchedOrgs.map((org: Organization) => ({
                    value: org.organizationID ? org.organizationID.toString() : '',
                    name: org.name,
                }));
                setOrganizations(orgOptions);
                if (selectedItem?.organizationID) {
                    console.log('Setting organizationID value:', selectedItem.organizationID); // Debug log
                    setValue('organizationID', selectedItem.organizationID.toString());
                }
            } else {
                console.warn('No organizations fetched from the API');
            }
        }).catch(error => {
            console.error('Error fetching organizations:', error);
        });
    }, [selectedItem, setValue]);

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    };

    const onChange = (value: any, item: any) => {
        console.log(`Changing ${item.value} to ${value}`); // Debug log
        if (item.value === 'roleID') {
            setValue('roleID', value);
        }
        if (item.value === 'organizationID') {
            setValue('organizationID', value);
        }
    }

    useEffect(() => {
        if (!selectedItem) return;
    
        console.log('Selected item:', selectedItem);
        console.log('Available roles:', roles);
        console.log('Available organizations:', organizations);
    
        // Find and set roleID if it exists in roles
        const role = roles.find(r => r.name === selectedItem.roleName);
        if (role) {
            setValue('roleID', Number(role.value)); // Ensure role.value is a string
            console.log('Setting roleID value:', role.value);
        } else {
            console.warn('Role not found for roleName:', selectedItem.roleName);
        }
    
        // Find and set organizationID if it exists in organizations
        const organization = organizations.find(o => o.name === selectedItem.name);
        if (organization) {
            setValue('organizationID', Number(organization.value)); // Ensure organization.value is a string
            console.log('Setting organizationID value:', organization.value);
        } else {
            console.warn('Organization not found for name:', selectedItem.name);
        }
    }, [selectedItem, roles, organizations, setValue]);
    useEffect(() => {
        const fetchRolesAndOrganizations = async () => {
            try {
                const [rolesResponse, organizationsResponse] = await Promise.all([
                    userSvc.getRoles(),
                    userSvc.getOrganizations()
                ]);
    
                console.log('Fetched roles:', rolesResponse);
                console.log('Fetched organizations:', organizationsResponse);
    
                if (rolesResponse && Array.isArray(rolesResponse)) {
                    setRoles(rolesResponse.map((res: Role) => ({
                        value: res.roleId.toString(),
                        name: res.roleName
                    })));
                }
    
                if (organizationsResponse && Array.isArray(organizationsResponse)) {
                    setOrganizations(organizationsResponse.map((org: Organization) => ({
                        value: org.organizationID.toString(),
                        name: org.name
                    })));
                }
            } catch (error) {
                console.error('Error fetching roles and organizations:', error);
            }
        };
    
        fetchRolesAndOrganizations();
    }, [userSvc]);
    
    const getListofItemsForDropdown = (item: any) => {
        if (item.value === 'roleID') {
            return roles.map(role => ({
                value: role.value,
                name: role.name
            }));
        }
        if (item.value === 'organizationID') {
            return organizations.map(org => ({
                value: org.value,
                name: org.name
            }));
        }
        return [];
    };

    const onSubmit = async (item: UserFormValues) => {
        try {
            let obj: User = { ...selectedItem };
            obj = Util.toClassObject(obj, item);
            obj.isActive = item.isActive;
            obj.roleId = item.roleID !== null ? Number(item.roleID) : 0;
            obj.organizationId = item.organizationID !== null ? Number(item.organizationID) : 0;
            obj.lastLogin = new Date();
            obj.createdBy = Util.UserProfile()?.userId;
            obj.userId = obj.userId ?? 0;
            obj.createdDate = obj.createdDate || new Date().toISOString();

            const response = obj.userId > 0 
                ? await userSvc.putItemBySubURL(obj, `${obj.userId}`) 
                : await userSvc.postItem(obj);

            if (response) {
                toast.success(`User ${obj.userId > 0 ? 'updated' : 'created'} successfully`);
                onSave();
                setDialogIsOpen(false);
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <FormProvider {...methods}>
            <AddEditDialog
                dialogIsOpen={dialogIsOpen}
                header={`${selectedItem.userId > 0 ? 'Edit' : 'Add'} User`}
                dialogSize={"m"}
                onSave={handleSubmit(onSubmit)}
                closeDialog={oncloseDialog}
                onClose={oncloseDialog}
            >
                <div className="modelformfiledrow row">
                    <div>
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
                </div>
            </AddEditDialog>
        </FormProvider>
    );
};

export default UsersAddEditDialog;
