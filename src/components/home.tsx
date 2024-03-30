import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { UtilService } from "../services/utilService";
import { ErrorBoundary } from "react-error-boundary";

export const Home=()=>{
    const navigator = useNavigate();
    const utilSvc = new UtilService(ErrorBoundary);

    useEffect(()=>{
        
        navigator("/pipeline");
        utilSvc.getDropdownValues().then(res=>{
            
        })
    },[])

    return(
        <>
        </>
    )
}