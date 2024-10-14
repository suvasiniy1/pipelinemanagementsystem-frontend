import { useState, useMemo, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { Tasks } from "../../models/task"; // Import the Task model
import { TaskService } from "../../services/taskService"; // Import the Task service
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import { GridRowSelectionModel } from '@mui/x-data-grid'; // Import GridRowSelectionModel type
import GroupEmailDialog from '../GroupEmailDialog'; 
import { EmailTemplate } from '../../models/emailTemplate';
import { EmailTemplateService } from '../../services/emailTemplateService'; 
import { TaskAddEdit } from '../pipeline/deal/activities/tasks/taskAddEdit';

const TasksList = () => {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [rowData, setRowData] = useState<Array<Tasks>>([]);
    const [groupEmailDialogOpen, setGroupEmailDialogOpen] = useState(false); 
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Memoize the TaskService and EmailTemplateService instance
    const taskService = useMemo(() => new TaskService(ErrorBoundary), []);
    const templateSvc = useMemo(() => new EmailTemplateService(ErrorBoundary), []);

    // Load task data from the API
    const loadTasksData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        taskService.getAllTasks()
          .then((res: Array<Tasks>) => {
            console.log("API Response:", res);
            const transformedData = res.map(rowTransform);
            console.log("Transformed Data:", transformedData);
            setRowData(transformedData);
          })
          .catch((err) => {
            console.error("Error loading task data:", err);
            toast.error(`Failed to load tasks: ${err.message || "Unknown error"}`);
          });
      } catch (error) {
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Row transformation function
    const rowTransform = (item: Tasks, index: number) => {
      return {
          ...item,
          id: item.taskId > 0 ? item.taskId : index,
          email: item.email || 'No email available', // Ensure email is populated
      };
  };

    // Handle row selection change
    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
      console.log("Selection Changed: ", newSelection); // Add this
      setSelectedRows(newSelection);
      console.log("Updated Selected Rows: ", selectedRows); // Log after setting the selected rows
  };

    // Toggle all rows selection
    const toggleSelectAll = () => {
        if (selectAllChecked) {
            setSelectedRows([]);
        } else {
            const allRowIds = rowData.map(row => row.taskId);
            setSelectedRows(allRowIds);
        }
        setSelectAllChecked(!selectAllChecked);
    };

    // Open Group Email Dialog
    const openGroupEmailDialog = () => {
        setGroupEmailDialogOpen(true);
    };

    // Close Group Email Dialog
    const closeGroupEmailDialog = () => {
        setGroupEmailDialogOpen(false);
    };

    // Handle template selection
    const handleTemplateSelect = (template: EmailTemplate) => {
        setSelectedTemplate(template);
    };

    // Fetch templates on component mount
    useEffect(() => {
        templateSvc.getEmailTemplates()
            .then((res: Array<EmailTemplate>) => {
                setTemplates(res);
            })
            .catch((err) => {
                console.error("Error loading templates:", err);
                toast.error("Failed to load templates.");
            });
    }, [templateSvc]);

    // Load tasks on component mount
    useEffect(() => {
        loadTasksData(); // Load tasks directly
    }, []);

    // Column metadata
    const columnMetaData = [
        {
            field: 'select',
            columnName: 'select',
            columnHeaderName: '',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => (
              <Checkbox
              indeterminate={selectedRows.length > 0 && selectedRows.length < rowData.length}
              checked={selectedRows.length === rowData.length && rowData.length > 0}
              onChange={() => setSelectedRows(selectedRows.length === rowData.length ? [] : rowData.map(row => row.taskId))} // Select All or Deselect All
              inputProps={{ 'aria-label': 'select all rows' }}
          />
            )
        },
        { columnName: "name", columnHeaderName: "Subject", width: 150 },
        { columnName: "treatmentName", columnHeaderName: "Deal", width: 150 },
        { columnName: "personName", columnHeaderName: "Contact Person", width: 150 },
        { columnName: "email", columnHeaderName: "Email", width: 150 },
        { columnName: "phone", columnHeaderName: "Phone Number", width: 150 },
        { columnName: "dueDate", columnHeaderName: "Due Date", width: 150 },
        { columnName: "duration", columnHeaderName: "Duration (hours)", width: 150 },
    ];

    return (
        <>
            <ItemCollection
                itemName={"Activity"}
                itemType={Tasks}
                columnMetaData={columnMetaData}
                viewAddEditComponent={TaskAddEdit}
                itemsBySubURL={"GetAllTask"} // Correct URL endpoint for getting tasks
                rowTransformFn={rowTransform}
                api={taskService} // Task service to interact with API
                enableCheckboxSelection={true} // This enables the selection mechanism
                onSelectionModelChange={handleSelectionChange} // Use the selection change handler
                rowData={rowData} // Pass row data
                isLoading={isLoading} // Show loading spinner if data is loading
            />
            <GroupEmailDialog
                open={groupEmailDialogOpen}
                onClose={closeGroupEmailDialog}
                selectedRecipients={selectedRows.map(id => {
                  const person = rowData.find(row => row.taskId === id); // Ensure the ID is correctly matched
                  return person ? person.email : '';
              })}
                selectedTemplate={selectedTemplate}
                templates={templates}
                onTemplateSelect={handleTemplateSelect}
            />
        </>
    );
};

export default TasksList;
