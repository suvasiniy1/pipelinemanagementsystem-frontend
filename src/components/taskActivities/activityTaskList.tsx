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
import { loginRequest } from "../pipeline/deal/activities/email/authConfig"; // MSAL login request configuration
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const TasksList = () => {
    const { instance, accounts } = useMsal();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isTokenLoading, setIsTokenLoading] = useState(true); // To manage token loading state
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

    useEffect(() => {
      if (accounts.length === 0) {
        instance.loginPopup(loginRequest).catch(e => {
          console.error(e);
        });
      }
    }, [accounts, instance]);

    // Handle user login
    const handleLogin = async (): Promise<void> => {
        try {
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: loginRequest.scopes,
                account: accounts[0], // Ensure there’s an active account
            });
            setAccessToken(tokenResponse.accessToken);
            console.log("Token acquired: ", tokenResponse.accessToken);
        } catch (error: any) {
            if (error.name === "InteractionRequiredAuthError") {
                await instance.loginPopup(loginRequest); // Trigger popup login if needed
                handleLogin(); // Retry login after interactive login
            } else {
                console.error("Login Error: ", error);
            }
        } finally {
            setIsTokenLoading(false); // Set loading state to false after token acquisition attempt
        }
    };

    // Get access token (now with explicit return type)
    const getAccessToken = async () => {
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: loginRequest.scopes,
          account: accounts[0],
        });
        console.log('Access token acquired:', tokenResponse.accessToken);
        return tokenResponse.accessToken;
      } catch (err: any) { // Explicitly typing err as 'any' to resolve the error
        if (err.name === 'InteractionRequiredAuthError') {
          try {
            const tokenResponse = await instance.loginPopup(loginRequest);
            return tokenResponse.accessToken;
          } catch (loginError) {
            console.error('Login failed: ', loginError);
          }
        } else {
          console.error('Token acquisition failed: ', err);
        }
      }
    };
    // Load task data from the API
    const loadTasksData = async (): Promise<void> => {
      setIsLoading(true); // Show loading spinner
      try {
        await getAccessToken(); // Call token acquisition (but do not pass token to API)
        taskService.getAllTasks() // Remove the token argument
          .then((res: Array<Tasks>) => {
            const transformedData = res.map(rowTransform);
            setRowData(transformedData);
          })
          .catch((err) => {
            console.error("Error loading task data:", err);
            toast.error(`Failed to load tasks: ${err.message || "Unknown error"}`);
          });
      } catch (error) {
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false); // Hide loading spinner
      }
    };

    // Row transformation function
    const rowTransform = (item: Tasks, index: number) => {
        return {
            ...item,
            id: item.taskId > 0 ? item.taskId : index,
        };
    };

    // Handle row selection change
    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRows(newSelection);
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

    // Trigger login or load tasks on component mount
    useEffect(() => {
        if (accounts.length === 0) {
            handleLogin(); // Trigger login if no accounts are available
        } else {
            loadTasksData(); // Load tasks if already logged in
        }
    }, [accounts]);

    // Render if token is still being loaded
    if (isTokenLoading) {
        return <div>Loading...</div>;
    }

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
                    onChange={toggleSelectAll}
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
                enableCheckboxSelection={true}
                onSelectionModelChange={handleSelectionChange} // Use the selection change handler
                rowData={rowData} // Pass row data
                isLoading={isLoading} // Show loading spinner if data is loading
            />
            <GroupEmailDialog
                open={groupEmailDialogOpen}
                onClose={closeGroupEmailDialog}
                selectedRecipients={selectedRows.map(id => {
                    const task = rowData.find(row => row.taskId === id);
                    return task ? task.email : '';
                })}
                selectedTemplate={selectedTemplate}
                templates={templates}
                onTemplateSelect={handleTemplateSelect}
            />
        </>
    );
};

export default TasksList;
