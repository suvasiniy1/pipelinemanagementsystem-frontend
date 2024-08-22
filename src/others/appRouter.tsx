import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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
import EmailsList from "../components/emailCampaign/emailConfiguration/emailsConfigurationList";
import EmailConfigurationList from "../components/emailCampaign/emailConfiguration/emailsConfigurationList";
import CampaignList from "../components/emailCampaign/campaign/campaignList";
import CampaignDetails from "../components/emailCampaign/campaign/campaignDetails";
import { AuthProvider } from "../components/pipeline/deal/activities/email/authProvider";
import UsersList from "../components/userManagement/userList"; 
import PersonList from "../components/person/personList";

export const AppRouter = () => {
  useEffect(() => {
    var e = document.getElementById("sideNav") as HTMLDivElement;
    if (e) {
      let className = LocalStorageUtil.getItem(Constants.SIDEBAR_CLASS) as any;
      e.classList.remove(getClasTobeRemoved(className));
      e.classList.add(className);
    }
  }, []);

  const getClasTobeRemoved = (className: string) =>
    className === "sidenavExpand" ? "sidenavCollapse" : "sidenavExpand";

  return (
    <>
      <Routes>
        <Route path="/pipeline" element={<Deals />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pipeline/edit" element={<Stages stages={[]} />} />
        <Route path="/pipeline/add" element={<Stages stages={[]} />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/Stages" element={<Stages stages={[]} />} />
        <Route path="/deals" element={<Deals />} />
        <Route
          path="/deal"
          element={
            <AuthProvider>
              <DealDetails />
            </AuthProvider>
          }
        />
        <Route path="/Template" element={<TemplatesList />} />
        <Route path="/Contact" element={<ContactsList />} />
        <Route path="/Email" element={<EmailConfigurationList />} />
        <Route path="/Campaigns" element={<CampaignList />} />
        <Route path="/CampaignDetails" element={<CampaignDetails />} />
        <Route path="/users" element={<UsersList />}/>
        <Route path="/Person" element={<PersonList />}/>
      </Routes>
      <ToastContainer />
    </>
  );
};
