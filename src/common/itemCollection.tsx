import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Util from "../others/util";
import ErrorFallback from "./errorFallBack";
import Table from "./table";
import { Spinner } from "react-bootstrap";
import { GridRowSelectionModel } from '@mui/x-data-grid';
import PluseIcon from '@material-ui/icons/Add';  // Add icon
import GroupEmailDialog from '../components/GroupEmailDialog';
import { EmailTemplateService } from '../services/emailTemplateService'; // Import the EmailTemplateService
import { EmailTemplate } from '../models/emailTemplate'; // Import EmailTemplate model

type params = {
  isNotListingPage?: boolean;
  itemName: any;
  itemType?: any;
  columnMetaData: any;
  viewAddEditComponent?: any;
  api?: any;
  postLoadData?: any;
  onPostLoadData?: any;
  itemsBySubURL?: any;
  itemsByPostURL?: any;
  canAdd?: boolean;
  rowTransformFn?: any;
  canProcessRowData?: boolean;
  dialogIsOpen?: any;
  canDoActions?: boolean;
  filterRowDataFn?: any;
  canShowClone?: any;
  canShowDelete?: any;
  defaultSortField?: string;
  selectedItem?: any;
  onDelete?: any;
  postDelete?: any;
  pageSize?: any;
  onValidate?: any;
  canShowValidate?: boolean;
  reloadDataOnSignalNotificationIndicator?: number;
  rowData?: any;
  renderRightActions?: any;
  renderIndications?: any;
  renderFooter?: any;
  isLoading?: boolean;
  customTableHeader?: any;
  addButtonName?: string;
  propNameforSelector?: string;
  canExport?: boolean;
  canShowDropdownForFilter?: boolean;
  customActions?: any;
  propNameforDelete?: string;
  displayTableHeaderasSingler?: boolean;
  onSave?:any;
  onSelectionModelChange?: any; // Add this
  checkboxSelection?: boolean; // Ensure checkboxSelection is handled
  enableCheckboxSelection?: boolean; 
  openGroupEmailDialog?:any;
};

const ItemCollection: React.FC<params> = (props) => {
  console.log("ItemCollection - props: ", props);

  const [defaultSortField, setDefaultSortField] = useState(
    props.defaultSortField ? props.defaultSortField : "modifiedOn"
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(
    props.dialogIsOpen ? props.dialogIsOpen : false
  );
  const [canShowValidate, setCanShowValidate] = useState(
    props.canShowValidate ? props.canShowValidate : false
  );
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isClone, setIsClone] = useState(false);
  const [itemsBySubURL, setItemsBySubURL] = useState(props.itemsBySubURL);
  const [itemsByPostURL, setItemsByPostURL] = useState(props.itemsByPostURL);
  const [selectedItemUser, setSelectedItemUser] = useState(
   Util.clone(props.selectedItem ?? new props.itemType())
  );

  const {
    itemName,
    customTableHeader,
    itemType,
    columnMetaData,
    viewAddEditComponent,
    api,
    displayTableHeaderasSingler,
    enableCheckboxSelection = false,
    
  } = props;
  const [canAdd, setCanAdd] = useState(
    props.canAdd != null ? props.canAdd : true
  );
  const [canShowClone, setCanShowClone] = useState(
    !Util.isNullOrUndefinedOrEmpty(props.canShowClone)
      ? props.canShowClone
      : false
  );
  const [canDoActions, setCanDoActions] = useState(
    !Util.isNullOrUndefinedOrEmpty(props.canDoActions)
      ? props.canDoActions
      : true
  );
  const canShowDelete = !Util.isNullOrUndefinedOrEmpty(props.canShowDelete)
    ? props.canShowDelete
    : true;
  const [pageSize, setPagesize] = useState(
    props.pageSize ? props.pageSize : null
  );
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [rowData, setRowData] = useState(props.rowData ? props.rowData : null);
  const [isLoading, setIsloading] = useState(
    props.isLoading ? props.isLoading : false
  );
  const [propNameforSelector, setPropNameforSelector] = useState(
    props.propNameforSelector ? props.propNameforSelector : null
  );
  const [addButtonName, setAddButtonName] = useState(
    props.addButtonName ? props.addButtonName : "Add"
  );
  const [renderRightActions, setRenderRightActions] = useState(
    props.renderRightActions
  );
  const [canProcessRowData, setCanProcesRowData] = useState(
    !Util.isListNullOrUndefinedOrEmpty(props.canProcessRowData)
      ? props.canProcessRowData
      : true
  );
  const [renderIndications, setRenderIndications] = useState(
    !Util.isNullOrUndefined(props.renderIndications)
      ? props.renderIndications
      : null
  );
  const [renderFooter, setRenderFooter] = useState(
    !Util.isNullOrUndefinedOrEmpty(props.renderFooter)
      ? props.renderFooter
      : null
  );
  const [canShowDropdownForFilter, setCanShowDropdownForFilter] = useState(
    !Util.isNullOrUndefinedOrEmpty(props.canShowDropdownForFilter)
      ? props.canShowDropdownForFilter
      : true
  );
  const [propNameforDelete, setPropNameforDelete] = useState(
    props.propNameforDelete ? props.propNameforDelete : "name"
  );
  const customActions = (data?: any) => {
    return props.customActions ? props.customActions(data) : null;
  };
  // If any translations need to be handled after receiving the itemList then postLoada method can be called from derived components
  const postLoadData = (data?: any) => {
    return props.postLoadData ? props.postLoadData(data) : data;
  };

  // If any translations need to be handled while opening the popup then onPostLoada method can be called from derived components
  const onPostLoadData = (data?: any) => {
    return props.onPostLoadData ? props.onPostLoadData(data) : data;
  };

  const rowTransformFn = (data?: any) => {
    return props.rowTransformFn
      ? props.rowTransformFn(baseRowTransformFn(data))
      : baseRowTransformFn(data);
  };

  const filterRowDataFn = (data?: any) => {
    return props.filterRowDataFn ? props.filterRowDataFn(data) : data;
  };

  const onDelete = (data1?: any, data2?: any) => {
    return props.onDelete ? props.onDelete(data1, data2) : null;
  };

  const postDelete = () => {
    return props.postDelete ? props.postDelete() : null;
  };

  const onValidate = (data?: any) => {
    return props.onValidate ? props.onValidate(data) : null;
  };

  const [canExport, setCanExport] = useState(
    !Util.isNullOrUndefinedOrEmpty(props.canExport) ? props.canExport : true
  );

  const [isSaveorUpdateClicked, setIsSaveorUpdateClicked] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [groupEmailDialogOpen, setGroupEmailDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  useEffect(() => {
    // Fetch templates using the EmailTemplateService
    const templateService = new EmailTemplateService(ErrorBoundary);
    templateService.getEmailTemplates()
      .then((res: EmailTemplate[]) => {
        setTemplates(res);
      })
      .catch(err => {
        console.error('Error fetching templates:', err);
      });
  }, []);
  useEffect(() => {
    let rowData = props.rowData ?? [];
    rowData?.forEach(
      (item: any) => {
        item.updatedBy = Util.getUserNameById(item?.modifiedBy ?? item?.createdBy);
        item.updatedDate = item.modifiedDate ?? item.createdDate;
      }
    );
    setRowData([...rowData]);
  }, [props.rowData]);

  useEffect(() => {
    setRenderFooter(props.renderFooter);
  }, [props.renderFooter]);

  useEffect(() => {
    if (props.dialogIsOpen) {
      setDialogIsOpen(props.dialogIsOpen);
    }
    if (props.selectedItem) {
      setSelectedItemUser(props.selectedItem);
    }
  }, [props.dialogIsOpen]);

  useEffect(() => {
    setIsloading(props.isLoading as any);
  }, [props.isLoading]);

  useEffect(() => {
    console.log("Selected Rows Updated: ", selectedRows);
  }, [selectedRows]);

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    console.log("Selection Changed in ItemCollection: ", newSelection);
    setSelectedRows(newSelection);
    props.onSelectionModelChange(newSelection);  // Update the state with new selection
  };
  // Function to set the selected template
  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template); // Update state with selected template data
  };
  const openGroupEmailDialog = () => {
    props.openGroupEmailDialog(true);
  };


  const baseRowTransformFn = (item: any) => {
    return {
      ...item,
      renderValueinCustomFormat: [
        {
          key: "modifiedOn",
          val: "modifiedOn",
          customFormat: Util.toDateFormat(item.modifiedOn),
        },
      ],
    };
  };

  const tableListProps: any = {
    isNotListingPage: props.isNotListingPage,
    canProcessRowData: canProcessRowData,
    tableListHeader: customTableHeader
      ? customTableHeader
      : displayTableHeaderasSingler
      ? itemName
      : (itemName + "s").replace("ss", "s"),
    itemName: itemName,
    itemType: itemType,
    rowData: rowData,
    onSelectionModelChange: handleSelectionChange,
   // checkboxSelection: true,
    checkboxSelection: enableCheckboxSelection,
    renderRightActions: renderRightActions,
    renderIndications: renderIndications,
    renderFooter: renderFooter,
    columnMetaData: columnMetaData,
    hiddenColumns: "",
    viewAddEditComponent: viewAddEditComponent,
    itemsBySubURL: itemsBySubURL,
    itemsByPostURL: itemsByPostURL,
    canAdd: canAdd,
    canDoActions: canDoActions,
    canShowClone: canShowClone,
    canShowDelete: canShowDelete,
    canShowValidate: canShowValidate,
    defaultSortField: defaultSortField,
    propNameforSelector: propNameforSelector,
    propNameforDelete: propNameforDelete,
    pageSize: pageSize,
    addButtonName: addButtonName,
    canExport: canExport,
    canShowDropdownForFilter: canShowDropdownForFilter,
    customActions: customActions,
    viewAddEditComponentProps: {
      dialogIsOpen: dialogIsOpen,
      isReadOnly: isReadOnly,
      setDialogIsOpen: setDialogIsOpen,
      setIsReadOnly: setIsReadOnly,
      isClone: isClone,
      setIsClone: setIsClone,
      header: itemName,
      selectedItem: selectedItemUser,
      setSelectedItem: setSelectedItemUser,
      onSave: () => props.onSave(),
      onClose: () => console.log("onClose Invoked!!!"),
      closeDialog: () => {
        console.log("closeDialog Invoked!!!");
        setDialogIsOpen(false);
      },
      setLoadRowData: () => {},
    },
    serviceAPI: api,
    postLoadData: postLoadData,
    onPostLoadData: onPostLoadData,
    onDelete: onDelete,
    postDelete: postDelete,
    onValidate: onValidate,
    rowTransformFn: rowTransformFn,
    filterRowDataFn: filterRowDataFn,
    reloadDataOnSignalNotificationIndicator:
      props.reloadDataOnSignalNotificationIndicator,
  };

//   const onSave = (addUpdateItem: any, item: any, postbySubURL: string = "") => {
//     if (isSaveorUpdateClicked) {
//       return;
//     }
//     setIsSaveorUpdateClicked(true);
//     console.log(`onSubmit - addUpdate${itemName}: `, addUpdateItem);
//     let result = Util.isNullOrUndefinedOrEmpty(postbySubURL)
//       ? api.postOrPutItem(addUpdateItem)
//       : api.postItemBySubURL(addUpdateItem, postbySubURL);
//     let promise = new Promise<any>(
//       (resolve, reject) =>
//         result &&
//         result
//           .then((res: any) => {
//             console.log(`${itemName}: ${item.name} successfully added!`);
//             setIsSaveorUpdateClicked(false);
//             setDialogIsOpen(false);
//             resolve(res);
//           })
//           .catch((err: AxiosError) => {
//             console.log(
//               `${itemName}: ${item.name} add failed! error: - ${err}`
//             );
//             setDialogIsOpen(false);
//             setIsSaveorUpdateClicked(false);
//             reject(err);
//           })
//     );

//     return promise;
//   };


// Conditionally Render the Send Group Email Button
const renderSendGroupEmailButton = () => (
  selectedRows.length > 0 && (
    <div style={{ textAlign: 'right', marginBottom: '16px' }}>
      <button
        type="button"
        className="btn btn-success"
        onClick={openGroupEmailDialog} 
        style={{ marginRight: "16px" }}
      >
        + Send Group Email
      </button>
    </div>
  )
);
  const addorUpdateItem = () => {
    return (
      <>
        <div className="pipe-toolbar pt-3 pb-3">
          <div className="container-fluid">
            <div className="row toolbarview-row">
              <div className="col-sm-5 toolbarview-actions">
                <h4>{itemName+" List"}</h4>
              </div>
              <div className="col-sm-7 toolbarview-summery" hidden={!canAdd}>
                <div className="toolbarview-actionsrow">
                  {renderSendGroupEmailButton()}
                  
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={(e: any) =>{setSelectedItemUser(new props.itemType()) ; setDialogIsOpen(true)}}
                  >
                    + New {itemName}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <>
          {addorUpdateItem()}
          <div className="contactlist-row">
            <div className="container-fluid">             
              <Table {...tableListProps} />   
                     
            </div>
            <GroupEmailDialog 
              open={groupEmailDialogOpen} 
              onClose={() => setGroupEmailDialogOpen(false)}
              selectedRecipients={selectedRows.map((id) => {
                const item = props.rowData.find((row: { personID: number; email: string }) => row.personID === id);
                return item ? item.email : '';
              })}
              selectedTemplate={selectedTemplate} // Pass the selected template here
              templates={templates} // Pass the templates here
              onTemplateSelect={handleTemplateSelect} // Pass the handler here
            />
          </div>
        </>
      )}
    </ErrorBoundary>
  );
};

export default ItemCollection;
