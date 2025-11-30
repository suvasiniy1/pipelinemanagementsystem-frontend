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
import ReportingDashboard from "../components/reporting/reportingDashboard";
import ProfilePage from "../components/profiles/ProfilePage";
import EnquiryFormList from "../components/enquiryForm/enquiryFormsList";

import ClinicList from "../components/clinic/clinicList";
import SourceList from "../components/source/sourceList";
import TreatMentList from "../components/treatment/treatmentList";
import PipeLineTypeList from "../components/pipeLineType/pipeLineTypeList";
import TenantList from "../components/tenant/tenantList";
import ConfirmEmail from "../components/ConfirmEmail";
import ActivityTaskList from "../components/taskActivities/activityTaskList"
import ChangePassword from '../components/profiles/changePassword';
import { PipeLineType } from "../models/pipeLineType";



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
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/pipeline" element={<Deals />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={ <Login />} />
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
        <Route path="/Email" element={<EmailConfigurationList />} />
        <Route path="/Campaigns" element={<CampaignList />} />
        <Route path="/CampaignDetails" element={<CampaignDetails />} />
        <Route path="/users" element={<UsersList />}/>
        <Route path="/Person" element={<AuthProvider><PersonList /></AuthProvider>}/>
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/Reporting" element={<ReportingDashboard />}/>

        <Route path="/Clinic" element={<ClinicList />}/>
        <Route path="/Source" element={<SourceList />}/>
        <Route path="/Treatment" element={<TreatMentList />}/>
        <Route path="/PipeLineType" element={<PipeLineTypeList />} />
        <Route path="/Tenant" element={<TenantList />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/Activities" element={ <AuthProvider><ActivityTaskList /></AuthProvider>} />
 
      </Routes>
      <ToastContainer />
    </>
  );
};
