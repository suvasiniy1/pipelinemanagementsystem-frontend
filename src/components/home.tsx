import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const Home=()=>{
    const navigator = useNavigate();

    useEffect(()=>{
        navigator("/pipeline")
    },[])

    return(
        <>
        </>
    )
}