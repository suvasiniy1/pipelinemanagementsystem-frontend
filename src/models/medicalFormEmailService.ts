import axios from "axios";

export const sendMedicalFormEmail = async (payload: {
    to: string;
    bcc?: string[]; // ✅ already array, keep this
    subject: string;
    body: string;
  }) => {
    return axios.post("http://localhost:5127/api/email/send-medical-form", payload);
  };
  
  