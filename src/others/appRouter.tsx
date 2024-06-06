import { useEffect } from "react";
import {
    Route,
    Routes
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TemplatesList from "../components/emailCampaign/template/templatesList";
import { Home } from "../components/home";
import { Leads } from "../components/leads/leads";
import Login from "../components/login";
import { DealDetails } from "../components/pipeline/deal/dealDetails";
import { Deals } from "../components/pipeline/deal/deals";
import Stages from "../components/pipeline/stages/stages";
import LocalStorageUtil from "./LocalStorageUtil";
import Constants from "./constants";
import ContactsList from "../components/emailCampaign/contacts/contactsList";

export const AppRouter = () => {

    useEffect(() => {
        var e = document.getElementById("sideNav") as HTMLDivElement;
        if (e) {
            let className = LocalStorageUtil.getItem(Constants.SIDEBAR_CLASS) as any;
            e.classList.remove(getClasTobeRemoved(className))
            e.classList.add(className);
        }
    }, [])

    const getClasTobeRemoved = (className: string) => className === "sidenavExpand" ? "sidenavCollapse" : "sidenavExpand"

    return (
        <>
        <Routes>
            <Route
                path="/pipeline"
                element={<Deals />}
            />
                    <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/pipeline/edit"
                element={<Stages stages={[]} />}
            />
            <Route
                path="/pipeline/add"
                element={<Stages stages={[]} />}
            />
            <Route
                path="/leads"
                element={<Leads />}
            />
            <Route
                path="/Stages"
                element={<Stages stages={[]} />}
            />
            <Route
                path="/deals"
                element={<Deals />}
            />
            <Route
                path="/deal"
                element={<DealDetails />}
            />
             <Route
                path="/deal"
                element={<DealDetails />}
            />
            <Route
                path="/EmailTemplate"
                element={<TemplatesList />}
            />
                        <Route
                path="/Contact"
                element={<ContactsList />}
            />
        </Routes>
            <ToastContainer />  
        </>
    )
}