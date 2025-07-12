import axios from "axios";

const API_BASE_URL = window?.config?.ServicesBaseURL;

export const sendMedicalFormEmail = async (payload: {
    to: string;
    bcc?: string[]; // ✅ already array, keep this
    subject: string;
    body: string;
  }) => {
    return axios.post(`${API_BASE_URL}/email/send-medical-form`, payload);
  };
  
  