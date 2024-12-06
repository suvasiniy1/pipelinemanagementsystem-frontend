import { Client } from "@microsoft/microsoft-graph-client";

//#region Email
export const sendEmail = async (accessToken, body, emailId = null) => {
  // Example function to send email using access token
  try {
    // Replace with your actual email sending logic
    const response = await fetch(
      emailId
        ? `https://graph.microsoft.com/v1.0/me/messages/${emailId}/reply`
        : "https://graph.microsoft.com/v1.0/me/sendMail",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: body,
      }
    );
    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const getSentEmails = async (accessToken) => {
  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/messages",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch emails");
    }
    const data = await response.json();
    return data.value; // Assuming messages are returned in the 'value' property
  } catch (error) {
    console.error("Error fetching sent emails:", error);
    throw error;
  }
};

export const deleteEmail = async (accessToken, emailId) => {
  try {
    const deleteResponse = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages/${emailId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!deleteResponse.ok) {
      throw new Error("Failed to fetch emails");
    }
    const data = await deleteResponse.json();
    return data.value;
  } catch (error) {
    console.error("Error deleting email:", error);
  }
};

export const getEventsList=async(accessToken, userId, task)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/events`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const addCalendarEventToUser=async(accessToken, userId, task)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(task)
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data?.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const updateCalendarEventToUser=async(accessToken, userId, task, eventId)=>{
  
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/events/${eventId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(task)
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    
    const data = await response.json();
    return data?.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const deleteCalendarEventToUser=async(accessToken, userId, eventId)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error:", error);
  }
}

//#endregion

//#region Tasks
export const getListTasksList=async(accessToken, userId)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const createTasksList=async(accessToken, userId)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          "displayName": "Y1 Capital Tasks"
        })
      }
    );
    if (!response.ok) {
      throw new Error("Unable to create tasks list for given user id :"+ userId);
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const getTasksList=async(accessToken, userId, taskListId)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/${taskListId}/tasks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      }
    );
    if (!response.ok) {
      throw new Error("Unable to get tasks list for given user id :"+ userId + " task list id :"+taskListId);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const createTask=async(accessToken, userId, taskId, taskObj)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/${taskId}/tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(taskObj)
      }
    );
    if (!response.ok) {
      throw new Error("Unable to create tasks list for given user id :"+ userId);
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const updateTask=async(accessToken, userId, taskListId, taskObj)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/${taskListId}/tasks/${taskObj.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(taskObj)
      }
    );
    if (!response.ok) {
      throw new Error("Unable to create tasks list for given user id :"+ userId);
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const deleteTask=async(accessToken, userId, taskListId, taskGuId)=>{
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/${taskListId}/tasks/${taskGuId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      }
    );
    if (!response.ok) {
      throw new Error("Unable to create tasks list for given user id :"+ userId);
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

//#endregion
const validateInput = (value, fieldName) => {
  if (!value) {
    console.error(`${fieldName} is required but undefined.`);
    throw new Error(`${fieldName} is required but undefined.`);
  }
};
export const getUserDetails=async(accessToken, userEmail)=>{
  validateInput(userEmail, "User Email");
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userEmail}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    
    const data = await response.json();
    return data?.id;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
