import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

import {
  Button,
  Grid
} from "@material-ui/core";
import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridColumnHeaderParams,
  gridClasses,
} from "@mui/x-data-grid";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Util from "../others/util";
import { DeleteDialog } from "./deleteDialog";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
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
  renderCell?: (params: GridCellParams) => JSX.Element;
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
  checkboxSelection?: boolean;
  onSelectionModelChange?: (newSelection: GridRowSelectionModel) => void;
  customRowData?:boolean;
  hidePagination?:boolean;
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
  canClose?:any;
}

const Table: React.FC<TableListProps> = (props) => {
  const [rowData, setRowData] = useState(props.rowData ?? []);
  const [columnMetaData, setColumnMetaRowData] = useState(props.columnMetaData);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const checkboxSelection = props.checkboxSelection;
  const onSelectionModelChange = props.onSelectionModelChange;

  const [loadRowData, setLoadRowData] = useState(false);
  const canDoActions = props.canDoActions;
  const propNameforSelector = props.propNameforSelector;
  const selectedItem = props.viewAddEditComponentProps.selectedItem;
  const setSelectedItem = props.viewAddEditComponentProps.setSelectedItem;
  const dialogIsOpen: boolean = props.viewAddEditComponentProps.dialogIsOpen;
  const setDialogIsOpen = props.viewAddEditComponentProps.setDialogIsOpen;
  const [actionType, setActionType] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const userProfile = Util.UserProfile();
  const itemType = props.itemName;
  const [propNameforDelete, setPropNameforDelete] = useState(
    props.propNameforDelete ? props.propNameforDelete : "name"
  );

  useEffect(() => {
    setColumnMetaRowData(props.columnMetaData);
  }, [props]);

  useEffect(() => {
   if(loadRowData==true) loadData();
  }, [loadRowData]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if(!props.customRowData){
      setIsLoading(true);
      (props.itemsBySubURL
        ? props.serviceAPI.getItemsBySubURL(props.itemsBySubURL)
        : props.serviceAPI.getItems()
      )
        .then((res: Array<any>) => {
          console.log("res  " + JSON.stringify(res));
          res.forEach((r, index) => {
            r.id = r.id ?? index + 1;
            return r;
          });
          res = processRowData(res);
          var transformedRowData = res?.map((r: any) => {
            return props.rowTransformFn(r);
          });
          setRowData(transformedRowData);
          props.postLoadData(transformedRowData);
          setIsLoading(false);
          setLoadRowData(false);
        })
        .catch((err: any) => {
          setIsLoading(false);
          toast.error("Unable to retreive list");
        });
    }

  };

  const isISODateString = (value: any): boolean => {
    return (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[\+\-]\d{2}:\d{2})?$/.test(value)
    );
  };

  const processRowData = (rowData: Array<any>) => {
    rowData.forEach((r) => {
      // Add modifiedBy using fallback logic
      r.modifiedBy = Util.getUserNameById(r.updatedBy ?? r.createdBy);
  
      // Loop through properties and format ISO date strings
      Object.keys(r).forEach((key) => {
        const value = r[key];
        if (isISODateString(value)) {
          r[key] = moment(value).format(window.config.DateFormat);
        }
      });
    });
    return rowData;
  };

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
  useEffect(() => {
    if (props.rowData) {
      setRowData(props.rowData);
    }
  }, [props.rowData]);
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
    if (onSelectionModelChange) {
      onSelectionModelChange(newSelection);
    }
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
          hideable : metaDataIter.hidden,
          hidden: metaDataIter.hidden ? false : true,
          width: metaDataIter.width,
          flex: metaDataIter.flex !== null ? metaDataIter.flex : 1,
          renderCell: metaDataIter.renderCell,
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
      width: 400,
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

    if (canDoActions) columnDefs.push(actions);
    return columnDefs;
  };

  const columnsMetaData = generateGridColDef();

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<Record<string, boolean>>(
    columnMetaData.reduce((acc, col) => {
      acc[col.columnName] = !col.hidden; // hidden: true => visible: false
      return acc;
    }, {} as Record<string, boolean>)
  );

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
        <StripedDataGrid
          rows={rowData}
          columns={columnsMetaData as any}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          checkboxSelection={checkboxSelection} // Enable checkbox selection
          onRowSelectionModelChange={handleSelectionChange}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          hideFooterPagination={props.hidePagination ?? false}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
        />
      )}
    </Grid>
  );
};
export default Table;
