import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PluseIcon from "@material-ui/icons/Add";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import {
  Button,
  Container,
  Grid,
  Typography,
  TablePagination,
  makeStyles,
} from "@material-ui/core";
import Util from "../others/util";
import renderCellExpand from "./renderCellExpand";
import { DeleteDialog } from "./deleteDialog";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  dataGrid: {
    color: "inherit",
    "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
      {
        outline: "solid blue 1px",
      },
    "& .MuiDataGrid-renderingZone": {
      "& .MuiDataGrid-row": {
        "&:nth-child(2n)": { backgroundColor: "#fafafa" },
      },
      "& .MuiDataGrid-row:hover": {
        backgroundColor: "#DCE9FD !important",
      },
      "& .MuiDataGrid-columnHeader:focus": {
        outline: "solid #DCE9FD 1px",
      },
      "& .MuiDataGrid-columnHeader--sortable:focus": {
        outline: "solid #DCE9FD 1px",
      },
      "& .MuiDataGrid-cell:focus": {
        outline: "solid #01579b 1px",
      },
    },
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    elevation: 3,
  },
  rootNew: {
    "& .super-app-theme--header": {
      backgroundColor: "rgba(255, 7, 0, 0.55)",
    },
  },
  root: {
    "& .wrapHeader .MuiDataGrid-colCellTitle": {
      overflow: "hidden",
      lineHeight: "20px",
      whiteSpace: "break-spaces",
    },
  },
}));

export interface TableColumnMetadata {
  columnName: any;
  field?: string;
  columnHeaderName?: string | null;
  flex?: number | null;
  width: number;
  originalWidth?: number;
  order?: number;
  index?: number;
  hidden: boolean;
  sort?: string;
  componentName?: string;
  type?: string;
}

export interface TableListProps {
  isNotListingPage?: boolean;
  canProcessRowData?: boolean;
  tableListHeader: string;
  itemName: any;
  itemType: any;
  rowData: null | any;
  renderRightActions?: null | any;
  renderIndications?: null | any;
  renderFooter?: null | any;
  rowTransformFn?: null | any;
  reloadDataOnSignalNotificationIndicator: number | undefined;
  renderCell?: null | any;
  columnMetaData: TableColumnMetadata[];
  hiddenColumns: null | any;
  viewAddEditComponent: any;
  viewAddEditComponentProps: ViewEditProps;
  itemsBySubURL?: any;
  itemsByPostURL?: any;
  canAdd?: boolean;
  postLoadData?: any;
  onPostLoadData?: any;
  canDoActions?: boolean;
  filterRowDataFn?: any;
  canShowClone?: boolean;
  canShowDelete?: boolean;
  defaultSortField?: string;
  onDelete?: any;
  postDelete?: any;
  pageSize: number;
  onValidate?: any;
  canShowValidate?: boolean;
  addButtonName?: string;
  queryByOrgs?: boolean;
  propNameforSelector: any;
  canExport?: boolean;
  canShowDropdownForFilter?: boolean;
  customActions?: any;
  propNameforDelete?: string;
  serviceAPI: any;
}

export interface ViewEditProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
  header: string;
  selectedItem: any;
  setSelectedItem: any;
  selectedItemList?: any;
  onSave: any;
  onClose: any;
  closeDialog: any;
  setLoadRowData: any;
  onPostLoadData?: any;
  isReadOnly?: boolean;
  setIsReadOnly?: any;
  isClone?: any;
  setIsClone?: any;
}

const Table: React.FC<TableListProps> = (props) => {
  
  const [rowData, setRowData] = useState(props.rowData ?? []);
  const [columnMetaData, setColumnMetaRowData] = useState(props.columnMetaData);
  
  const [loadRowData, setLoadRowData] = useState(true);
  const canDoActions = props.canDoActions;
  const propNameforSelector = props.propNameforSelector;
  const selectedItem = props.viewAddEditComponentProps.selectedItem;
  const setSelectedItem = props.viewAddEditComponentProps.setSelectedItem;
  const dialogIsOpen: boolean = props.viewAddEditComponentProps.dialogIsOpen;
  const setDialogIsOpen = props.viewAddEditComponentProps.setDialogIsOpen;
  const [actionType, setActionType] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const userProfile = Util.UserProfile();
  const classes = useStyles();
  const itemType = props.itemName;
  const [propNameforDelete, setPropNameforDelete] = useState(
    props.propNameforDelete ? props.propNameforDelete : "name"
  );

  useEffect(() => {
    setColumnMetaRowData(props.columnMetaData);
  }, [props]);

  useEffect(()=>{
    
    setIsLoading(true);
      (props.itemsBySubURL ? props.serviceAPI.getItemsBySubURL(props.itemsBySubURL) : props.serviceAPI.getItems()).then((res:Array<any>)=>{
        
        console.log("res  "+ JSON.stringify(res));
        res.forEach((r, index)=>{
          r.id= r.id?? index+1;
          return r;
        })
        res = processRowData(res);
        var transformedRowData = res?.map((r:any)=>{
          return props.rowTransformFn(r);
        });
        setRowData(transformedRowData);
        setIsLoading(false);
        setLoadRowData(false);
      }).catch((err:any)=>{
        setIsLoading(false);
        toast.error("Unable to retreive list");
      })
  },[loadRowData])

  const processRowData=(rowData:Array<any>)=>{
    rowData.forEach(r=>{
      r.modifiedBy = Util.getUserNameById(r.updatedBy ?? r.createdBy);
      r.modifiedDate = moment(r.updatedDate ?? r.createdDate).format(window.config.DateFormat)
    });
    return rowData;
  }

  const getSelectedItemfromCellValues = (cellValues: any) => {
    let newSelectedItem = { ...selectedItem };
    for (const [key, value] of Object.entries(new props.itemType())) {
      let rowDataValue = cellValues.row[key.toString()];
      newSelectedItem[key.toString()] = rowDataValue;
    }
    return newSelectedItem;
  };

  // For Edit Action
  const onClickEditListener = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    cellValues: GridCellParams,
    isReadOnly: boolean = false,
    isClone: boolean = false
  ) => {
    console.log(
      "TableListBase - onClickEditListener - cellValues.row: ",
      cellValues.row,
      " | selectedItem: ",
      selectedItem
    );

    let newSelectedItem = getSelectedItemfromCellValues(cellValues);
    console.log(
      "TableListBase - onClickEditListener - newSelectedItem: ",
      newSelectedItem
    );

    newSelectedItem = props.onPostLoadData(newSelectedItem);
    setSelectedItem(newSelectedItem);
    setDialogIsOpen(true);
    event.stopPropagation();
  };

  // For Delete Actions
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUserConfirmation, setShowUserConfirmation] = useState(false);
  const hideDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const onDeleteConfirm = () => {
    
    setIsLoading(true);
    props.serviceAPI
      .delete(selectedItem.id, userProfile.userId)
      .then((res: any) => {
        toast.success(itemType + " deleted successfully");
        
        if (props.postDelete) {
          props.postDelete();
        }
        setIsLoading(false);
        setLoadRowData(true);
      })
      .catch((err: any) => {
        toast.error("unable to delete " + itemType);
        setIsLoading(false);
      })
      .finally(() => {
        setShowDeleteDialog(false);
      });
  };

  const onClickDeleteListener = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    cellValues: GridCellParams
  ) => {
    console.log(
      "TableListBase - onClickDeleteListener - cellValues.row: ",
      cellValues.row
    );
    
    setShowDeleteDialog(true);
    setSelectedItem(cellValues.row);
    setActionType("Delete" as any);
    event.stopPropagation();
  };

  const generateGridColDef = (): GridColDef[] => {
    let index = 0;
    let columnDefs: GridColDef[] = columnMetaData.map(
      (metaDataIter: TableColumnMetadata, iterCnt: number) => {
        const headerValue: any =
          metaDataIter.columnHeaderName !== undefined &&
          metaDataIter.columnHeaderName !== null
            ? metaDataIter.columnHeaderName
            : Util.capitalizeFirstChar(metaDataIter.columnName);
        return {
          field: metaDataIter.columnName,
          headerName: headerValue,
          headerClassName: "wordWrap",
          headerAlign: "left",
          height: 500,
          width: metaDataIter.width,
          flex: metaDataIter.flex !== null ? metaDataIter.flex : 1,
          renderCell: renderCellExpand,
          renderHeader: (params: GridColumnHeaderParams) => {
            // console.log("renderHeader: ", params);
            // dataGridAPIRef = params.api;
            return (
              <div
                title={headerValue}
                style={{
                  whiteSpace: "normal",
                  lineHeight: "normal",
                  textAlign: "left",
                }}
              >
                <strong> {headerValue} </strong>
              </div>
            );
          },
        };
      }
    );

    let actions: GridColDef = {
      field: "actions",
      headerName: "Actions",
      headerAlign: "left",
      sortable: false,
      width: 200,
      disableColumnMenu: true,
      disableReorder: true,
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>Actions</strong>
      ),
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              // variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              title="Edit"
              id={`${
                propNameforSelector
                  ? "editItem_" +
                    getSelectedItemfromCellValues(cellValues)[
                      propNameforSelector
                    ]
                  : "editItem"
              }`}
              onClick={(event) => {
                onClickEditListener(event, cellValues, false);
              }}
              className="rowActionIcon"
            ></Button>
            {/* <Button
              // variant="contained"
              color="primary"
              startIcon={<PluseIcon />}
              title="Clone"
              id={`${
                propNameforSelector
                  ? "cloneItem_" +
                    getSelectedItemfromCellValues(cellValues)[
                      propNameforSelector
                    ]
                  : "cloneItem"
              }`}
              onClick={(event) => {
                onClickEditListener(event, cellValues, false, true);
              }}
              className="rowActionIcon"
            ></Button> */}

            <Button
              // variant="contained"
              color="primary"
              startIcon={<DeleteIcon />}
              title="Delete"
              id={`${
                propNameforSelector
                  ? "deleteItem_" +
                    getSelectedItemfromCellValues(cellValues)[
                      propNameforSelector
                    ]
                  : "deleteItem"
              }`}
              onClick={(event) => {
                onClickDeleteListener(event, cellValues);
              }}
              className="rowActionIcon"
            ></Button>
            {props.customActions ? props.customActions(cellValues) : null}
          </>
        );
      },
    };

    if(canDoActions) columnDefs.push(actions);
    return columnDefs;
  };

  const columnsMetaData = generateGridColDef();

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      style={{ padding: "0px", backgroundColor: "#ffffff" }}
    >
      {dialogIsOpen && (
        <props.viewAddEditComponent
          {...props.viewAddEditComponentProps}
          setLoadRowData={setLoadRowData}
          selectedItemList={rowData}
        />
      )}
      {showDeleteDialog && (
        <DeleteDialog
          itemType={itemType}
          itemName={selectedItem[propNameforDelete]}
          dialogIsOpen={showDeleteDialog}
          closeDialog={hideDeleteDialog}
          onConfirm={onDeleteConfirm}
          isPromptOnly={false}
          actionType={actionType}
        />
      )}
            {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
      <DataGrid
        rows={rowData}
        className={classes.dataGrid}
        columns={columnsMetaData as any}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
      )}
    </Grid>
  );
};
export default Table;
