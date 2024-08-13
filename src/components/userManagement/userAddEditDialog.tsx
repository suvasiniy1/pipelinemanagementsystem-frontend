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
import { RxValue } from 'react-icons/rx';

// Import statements...

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
    const [visibilityGroups, setVisibilityGroups] = useState<Array<{ name: string; value: string }>>([]);
    useEffect(() => {
        userSvc.getVisibilityGroups().then((groups: VisibilityGroup[]) => {
            const uniqueGroups = new Set();
            const groupOptions = groups.map((group: VisibilityGroup) => ({
                value: group.visibilityGroupID.toString(),
                name: group.visibilityGroupName,
            })).filter(group => {
                const isDuplicate = uniqueGroups.has(group.name);
                uniqueGroups.add(group.value);
                return !isDuplicate;
            });
            console.log('Fetched visibility groups:', groupOptions); // Debugging
            setVisibilityGroups(groupOptions);
            // Ensure the selected value is set when editing
        if (selectedItem && selectedItem.visibilityGroupID) {
            setValue('visibilityGroupID', selectedItem.visibilityGroupID.toString());
        }
        });
    }, []);

    const controlsList: Array<IControl> = [
        {
            key: "Username",
            value: "userName",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12
        },
        {
            key: "Email Address",
            value: "email",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12,
            regex1: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errMsg1: "Please enter a valid email address"
        },
        {
            key: "Password",
            value: "passwordHash",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12,
            type: ElementType.password
        },
        {
            key: "Confirm Password",
            value: "confirmPassword",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12,
            type: ElementType.password
        },
        {
            key: "Role",
            value: "role",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12
        },
        {
            key: "Is Active",
            value: "isActive",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12,
            type: ElementType.checkbox,
            defaultValue: true,
            
        },
        {
            key: "Visibility Group",
            value: "visibilityGroupID",
            isRequired: true,
            isControlInNewLine: true,
            elementSize: 12,
            type: ElementType.dropdown,
            options: visibilityGroups.map(group => ({
                key: group.name,
                value: group.value
            })), // Bind the dropdown to fetched groups
        }


    ];

    const getValidationsSchema = (list: Array<any>) => {
        return Yup.object().shape({
            userName: Yup.string().required('Username is required'),
            email: Yup.string().required('Email is required').email('Email is not valid'),
            passwordHash: Yup.string().required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('passwordHash')], 'Passwords must match')
                .required('Confirm Password is required'),
            role: Yup.string().required('Role is required'),
            isActive: Yup.boolean().required("Active status is required"),
            visibilityGroupID: Yup.number().required('Visibility Group must be selected')
        });
    };
    
    // Set up form default values
    const formOptions = {
        resolver: yupResolver(getValidationsSchema(controlsList)),
        defaultValues: {
            userName: selectedItem?.userName || '',
            email: selectedItem?.email || '',
            passwordHash: '',
            confirmPassword: '',
            role: selectedItem?.role || '',
            isActive: selectedItem?.isActive ?? true,
            visibilityGroupID: selectedItem?.visibilityGroupID ?? 0,
        },
    };
    
    const methods = useForm<UserFormValues>(formOptions);

    const { handleSubmit, unregister, register, resetField, setValue, setError } =
        methods;

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    };
   
    const onChange = (value: any, item: any) => {

    }
    useEffect(() => {
        if (!selectedItem) {
            setValue('isActive', true); // Ensure checkbox is checked by default for new user
        }
    }, [selectedItem, setValue]);
    const onSubmit = (item: any) => {
        console.log(item.isActive);
        let obj: User = { ...selectedItem };
        obj = Util.toClassObject(obj, item);
        obj.isActive = item.isActive; 
        obj.visibilityGroupID = item.visibilityGroupID; 
        obj.lastLogin = new Date(); 
        obj.createdBy = Util.UserProfile()?.userId;
        obj.userId = obj.userId ?? 0;
        obj.createdDate = obj.createdDate || new Date().toISOString();
        
        (obj.userId > 0 ? userSvc.putItemBySubURL(obj, `${obj.userId}`) : userSvc.postItem(obj)).then(res => {

            if (res) {
                toast.success(`User ${obj.userId > 0 ? 'updated' : 'created'} successfully`);
                props.onSave();
            }
            setDialogIsOpen(false);
        }).catch((err: any) => {
            toast.error(`Unable to ${obj.userId > 0 ? 'update' : 'save'} user `);
        })

    };

    return (
        <>
            {
                <FormProvider {...methods}>
                    <AddEditDialog
                        dialogIsOpen={dialogIsOpen}
                        header={`${selectedItem.userId > 0 ? 'Edit' : 'Add'} User`}
                        dialogSize={"m"}
                        onSave={handleSubmit(onSubmit)}
                        closeDialog={oncloseDialog}
                        onClose={oncloseDialog}
                    >
                        <>
                            <div className="modelformfiledrow row">
                                <div>
                                    <div className="modelformbox ps-2 pe-2">
                                        {
                                             <GenerateElements
                                             controlsList={controlsList}
                                             selectedItem={selectedItem}
                                             visibilityGroups={visibilityGroups} // Pass visibilityGroups here
                                             onChange={(value: any, item: any) =>
                                                 onChange(value, item)
                                             }
                                         />

                                        }
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </>
                        <br />
                    </AddEditDialog>
                </FormProvider>
            }
        </>
    );
};

export default UsersAddEditDialog;
