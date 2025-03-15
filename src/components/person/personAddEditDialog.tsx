import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AddEditDialog } from "../../common/addEditDialog";
import GenerateElements from "../../common/generateElements";
import { ViewEditProps } from "../../common/table";
import { ElementType, IControl } from "../../models/iControl";
import { Label } from "../../models/label";
import { Organization } from "../../models/organization";
import { Person } from "../../models/person";
import { Source } from '../../models/source';
import { User } from '../../models/user';
import { VisibilityGroup } from "../../models/visibilityGroup";
import Util from "../../others/util";
import { personService } from "../../services/personService";

const PersonAddEditDialog: React.FC<ViewEditProps> = (props) => {
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

    const personSvc = new personService(ErrorBoundary);
    const [organizations, setOrganizations] = useState<Array<{ name: string; value: string }>>([]);
    const [labels, setLabels] = useState<Array<{ name: string; value: string }>>([]);
    const [owners, setOwners] = useState<Array<{ name: string; value: string }>>([]);
    const [sources, setSources] = useState<Array<{ name: string; value: string }>>([]);
    const [visibilityGroups, setVisibilityGroups] = useState<Array<{ name: string; value: string }>>([]);

    const controlsList: IControl[] = [
        { key: "Person Name", value: "personName", isRequired: true, isControlInNewLine: true, elementSize: 12 },
        { key: "First Name", value: "firstName", isRequired: true, isControlInNewLine: true, elementSize: 12 },
        { key: "Last Name", value: "lastName", isRequired: true, isControlInNewLine: true, elementSize: 12 },
        { key: "Email Address", value: "email", isRequired: true, isControlInNewLine: true, elementSize: 12, regex1: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errMsg1: "Please enter a valid email address" },
        { key: "Phone Number", type: ElementType.number, value: "phone", isRequired: true, isControlInNewLine: true, elementSize: 12, regex1: /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/, errMsg1: "Please enter a valid phone number" },
        { key: "Organization", value: "organizationID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: organizations.map(org => ({ key: org.name, value: org.value })) },
        { key: "Label", value: "labelID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: labels.map(label => ({ key: label.name, value: label.value })) },
        { key: "Owner", value: "userID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: owners.map(owner => ({ key: owner.name, value: owner.value })) },
        { key: "Source", value: "sourceID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: sources.map(source => ({ key: source.name, value: source.value })) },
        { key: "Visibility Group", value: "visibilityGroupID", isRequired: true, isControlInNewLine: true, elementSize: 12, type: ElementType.dropdown, options: visibilityGroups.map(group => ({ key: group.name, value: group.value })) }
    ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const formOptions = {
    resolver: yupResolver(getValidationsSchema(controlsList)),
  };
    
  const methods = useForm(formOptions);
    const { handleSubmit, setValue } = methods;
    const { errors } = methods.formState;
    console.log('Validation errors:', errors);

    useEffect(() => {
        console.log('SelectedItem changed:', selectedItem); // Debug log
        personSvc.getOrganizations().then((fetchedOrgs) => {
            console.log('Fetched organizations:', fetchedOrgs); // Debug log
            if (fetchedOrgs && fetchedOrgs.length > 0) {
                const orgOptions = fetchedOrgs.map((org: Organization) => ({
                    value: org.organizationID ? org.organizationID.toString() : '',
                    name: org.name,
                }));
                setOrganizations(orgOptions);
                if (selectedItem?.organizationID) {
                    console.log('Setting organizationID value:', selectedItem.organizationID); // Debug log
                    setValue('organizationID' as never, selectedItem.organizationID.toString() as never);
                }
            } else {
                console.warn('No organizations fetched from the API');
            }
        }).catch(error => {
            console.error('Error fetching organizations:', error);
        });
        personSvc.getLabels().then((response) => {
            console.log('Fetched labels:', response); // Debug log
            if (response && Array.isArray(response) && response.length > 0) {
                const resOptions = response.map((res: Label) => ({
                    value: res.labelID ? res.labelID.toString() : '',
                    name: res.labelName,
                }));
                setLabels(resOptions);
                if (selectedItem?.labelID) {
                    console.log('Setting labelID value:', selectedItem.labelID); // Debug log
                    setValue('labelID' as never, selectedItem.labelID.toString() as never);
                }
            } else {
                console.warn('No labels fetched from the API');
            }
        }).catch(error => {
            console.error('Error fetching labels:', error);
        });
        personSvc.getOwners().then((response) => {
            console.log('Fetched users:', response); // Debug log
            if (response && Array.isArray(response) && response.length > 0) {
                const resOptions = response.map((res: User) => ({
                    value: res.userId ? res.userId.toString() : '', // Correctly map userId
                    name: res.userName,
                }));
                setOwners(resOptions);
                if (selectedItem?.userId) { // Use ownerID instead of userId
                    console.log('Setting ownerID value:', selectedItem.userId); // Debug log
                    setValue('userID' as never, selectedItem.userId.toString() as never);
                }
            } else {
                console.warn('No users fetched from the API');
            }            
        }).catch(error => {
            console.error('Error fetching users:', error);
        });
       
        personSvc.getSources().then((response) => {
            console.log('Fetched sources:', response); // Debug log
            if (response && Array.isArray(response) && response.length > 0) {
                const resOptions = response.map((res: Source) => ({
                    value: res.sourceID ? res.sourceID.toString() : '',
                    name: res.sourceName,
                }));
                setSources(resOptions);
                if (selectedItem?.sourceID) {
                    console.log('Setting sourceID value:', selectedItem.sourceID); // Debug log
                    setValue('sourceID' as never, selectedItem.sourceID.toString() as never);
                }
            } else {
                console.warn('No sources fetched from the API');
            }
        }).catch(error => {
            console.error('Error fetching source:', error);
        });
        personSvc.getVisibilityGroups().then((response) => {
            console.log('Fetched visibility groups:', response); // Debug log
            if (response && Array.isArray(response) && response.length > 0) {
                const resOptions = response.map((res: VisibilityGroup) => ({
                    value: res.visibilityGroupID ? res.visibilityGroupID.toString() : '',
                    name: res.visibilityGroupName,
                }));
                setVisibilityGroups(resOptions);
                if (selectedItem?.visibilityGroupID) {
                    console.log('Setting visibility group value:', selectedItem.visibilityGroupID); // Debug log
                    setValue('visibilityGroupID' as never, selectedItem.visibilityGroupID.toString() as never);
                }
            } else {
                console.warn('No visibility group from the API');
            }
        }).catch(error => {
            console.error('Error fetching visibility group:', error);
        });
    }, [selectedItem, setValue]);

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    };

    const onChange = (value: any, item: any) => {
        console.log(`Changing ${item.value} to ${value}`); // Debug log
        if (item.value === 'organizationID') {
            setValue('organizationID' as never, value as never);
        }
        if (item.value === 'labelID') {
            setValue('labelID' as never, value as never);
        }
        if (item.value === 'userID') {
            setValue('userID' as never, value as never);
        }
      
        if (item.value === 'sourceID') {
            setValue('sourceID' as never, value as never);
        }
        if (item.value === 'visibilityGroupID') {
            setValue('visibilityGroupID' as never, value as never);
        }
    }

    useEffect(() => {
        if (!selectedItem) return;
    
        console.log('Selected item:', selectedItem);
        console.log('Available labels:', labels);
        console.log('Available organizations:', organizations);
        console.log('Available owners:', owners);
    
        // Find and set label if it exists in roles
        const label = labels.find(r => r.name === selectedItem.labelName);
        if (label) {
            setValue('labelID' as never, Number(label.value) as never); 
            console.log('Setting labelID value:', label.value);
        } else {
            console.warn('label not found for labelName:', selectedItem.labelName);
        }
        //owner
        const owner = owners.find(r => r.name === selectedItem.userName);
       if (owner) {
        setValue('userID' as never, Number(owner.value) as never); 
        console.log('Setting ownerID value:', owner.value);
       } else {
        console.warn('owner not found for userName:', selectedItem.userName);
       }
     
        //source
        const source = sources.find(r => r.name === selectedItem.sourceName);
        if (source) {
            setValue('sourceID' as never, Number(source.value) as never); 
            console.log('Setting sourceID value:', source.value);
        } else {
            console.warn('source not found for sourceName:', selectedItem.sourceName);
        }
        //visbility
        const visibilityGroup = visibilityGroups.find(r => r.name === selectedItem.visibilityGroupName);
        if (visibilityGroup) {
            setValue('visibilityGroupID' as never, Number(visibilityGroup.value) as never); 
            console.log('Setting visibilityGroupID value:', visibilityGroup.value);
        } else {
            console.warn('visibilityGroup not found for visibilityGroupName:', selectedItem.visibilityGroupName);
        }
        // Find and set organizationID if it exists in organizations
        const organization = organizations.find(o => o.name === selectedItem.name);
        if (organization) {
            setValue('organizationID' as never, Number(organization.value)as never); // Ensure organization.value is a string
            console.log('Setting organizationID value:', organization.value);
        } else {
            console.warn('Organization not found for name:', selectedItem.name);
        }
    }, [selectedItem, labels,owners,sources,visibilityGroups, organizations, setValue]);

    useEffect(() => {
        const fetchLabelsAndOrganizations = async () => {
            try {
                const [labelResponse,ownerResponse,sourceResponse,visibilityGroupResponse,organizationsResponse] = await Promise.all([
                    personSvc.getLabels(),
                    personSvc.getOwners(),
                    personSvc.getSources(),
                    personSvc.getVisibilityGroups(),
                    personSvc.getOrganizations()
                ]);
    
                if (labelResponse && Array.isArray(labelResponse)) {
                    setLabels(labelResponse.map((res: Label) => ({
                        value: res.labelID.toString(),
                        name: res.labelName
                    })));
                }
                if (ownerResponse && Array.isArray(ownerResponse)) {
                    setOwners(ownerResponse.map((res: User) => ({
                        value: res.userId.toString(),
                        name: res.userName
                    })));
                }
                if (sourceResponse && Array.isArray(sourceResponse)) {
                    setSources(sourceResponse.map((res: Source) => ({
                        value: res.sourceID.toString(),
                        name: res.sourceName
                    })));
                }
                if (visibilityGroupResponse && Array.isArray(visibilityGroupResponse)) {
                    setVisibilityGroups(visibilityGroupResponse.map((res: VisibilityGroup) => ({
                        value: res.visibilityGroupID.toString(),
                        name: res.visibilityGroupName
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
    
        fetchLabelsAndOrganizations();
    }, [personSvc]);
    
    const getListofItemsForDropdown = (item: any) => {
        if (item.value === 'labelID') {
            return labels.map(label => ({
                value: label.value,
                name: label.name
            }));
        }
        if (item.value === 'userID') {
            return owners.map(owner => ({
                value: owner.value,
                name: owner.name
            }));
        }
        
        if (item.value === 'sourceID') {
            return sources.map(source => ({
                value: source.value,
                name: source.name
            }));
        }  
        if (item.value === 'visibilityGroupID') {
            return visibilityGroups.map(vg => ({
                value: vg.value,
                name: vg.name
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

    const onSubmit = (item: any) => {
        try {
            let obj: Person = { ...selectedItem };
            obj = Util.toClassObject(obj, item);
            obj.labelID = item.labelID !== null ? Number(item.labelID) : 0;
            obj.sourceID = item.sourceID !== null ? Number(item.sourceID) : 0;
            obj.ownerID = item.userID !== null ? Number(item.userID) : 0;
            obj.visibilityGroupID = item.visibilityGroupID !== null ? Number(item.visibilityGroupID) : 0;
            obj.organizationID = item.organizationID !== null ? Number(item.organizationID) : 0;
         
          //  obj.createdBy = Util.UserProfile()?.userId;
            obj.personID = obj.personID ?? 0;
            const userProfile = Util.UserProfile();
        const currentUserId = userProfile?.userId;
        const now = new Date();

        if (obj.personID > 0) {
            // Existing person
            obj.createdBy = obj.ownerID;
            obj.createdDate = obj.createdDate; 
            obj.modifiedBy = obj.ownerID;
            obj.modifiedDate = now;
        } else {
            // New person
            obj.createdBy = obj.ownerID ;
            obj.createdDate = now;
        }
           (obj.personID > 0 
                ? personSvc.putItemBySubURL(obj, `${obj.personID}`) 
                : personSvc.postItem(obj)).then(res=>{
                    toast.success(`Person ${obj.personID > 0 ? 'updated' : 'created'} successfully`);
                    setLoadRowData(true);
                    setDialogIsOpen(false);
                });

        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <FormProvider {...methods}>
            <AddEditDialog
                dialogIsOpen={dialogIsOpen}
                header={`${selectedItem.userId > 0 ? 'Edit' : 'Add'} Person`}
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

export default PersonAddEditDialog;
