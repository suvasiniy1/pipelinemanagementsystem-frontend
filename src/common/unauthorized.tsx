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
        
        if(error?.response?.status==401){
            alert("Session has expired");
            navigate("/login");
        }
        else{
            toast.error(customMessage ?? (isRetrivingList? "Unable to retreive the list" : "Unable to perform the action"), {delay:20});
        }
    },[error, customMessage])

    return (
        <>
        <ToastContainer/>
        </>
    )
}