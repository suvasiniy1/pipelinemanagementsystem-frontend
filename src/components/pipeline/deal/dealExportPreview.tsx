import { AddEditDialog } from "../../../common/addEditDialog";

type params = {
  previewData: Array<any>;
  selectedColumns: Array<any>;
  dialogIsOpen: any;
  setDialogIsOpen: any;
  onConfirmClick: any;
};

export const DealExportPrview = (props: params) => {
  
  const {
    previewData,
    selectedColumns,
    dialogIsOpen,
    setDialogIsOpen,
    onConfirmClick,
    ...others
  } = props;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const customFooter = () => {
    return (
      <>
        <div className="modalfootbar">
          {/* <div className="modelfootcountcol me-2">
                    <div className="modelfootcount me-2">1608/10000</div>
                    <button className="modelinfobtn"><i className="rs-icon rs-icon-info"></i></button>
                </div> */}
          <button
            onClick={oncloseDialog}
            className="btn btn-secondary btn-sm me-2"
            id="closeDialog"
          >
            Close
          </button>
          {/* <button
            type="submit"
            className={`btn btn-primary btn-sm save`}
            onClick={(e: any) => props.onConfirmClick()}
          >
            {"Save"}
          </button> */}
        </div>
      </>
    );
  };

  return (
    <AddEditDialog
      dialogIsOpen={dialogIsOpen}
      header={"Deals Export Preview"}
      closeDialog={oncloseDialog}
      onClose={oncloseDialog}
      customFooter={customFooter()}
    >
      {
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {selectedColumns.map((column, index) => {
                  return (
                    <th
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f6f9",
                        padding: "8px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {column?.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {previewData.length > 0 ? (
                previewData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor:
                        rowIndex % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    }}
                  >
                    {selectedColumns.map((column, colIndex) => {
                      return (
                        <td
                          key={colIndex}
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          {row[column.value]}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={selectedColumns.length}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      border: "1px solid #ddd",
                    }}
                  >
                    No preview data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    </AddEditDialog>
  );
};
