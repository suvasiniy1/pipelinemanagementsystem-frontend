import { AxiosError } from "axios"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

type params = {
    error: AxiosError;
    isRetrivingList?:boolean;
    customMessage?:string;
}

export const UnAuthorized = (props: params) => {
    
    const { error, isRetrivingList, customMessage, ...others } = props;
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("An unauthorized exception occured for one of the API call....please verify!");
        if(error?.response?.status === 401) {
            toast.error("Session has expired. Please login again.");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } else {
            toast.error(customMessage ?? (isRetrivingList? "Unable to retrieve the list" : "Unable to perform the action"), {delay:20});
        }
    },[error, customMessage])

    return (
        <>
        <ToastContainer/>
        </>
    )
}