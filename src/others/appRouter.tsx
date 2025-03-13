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

import ConfirmEmail from "../components/ConfirmEmail";
import ActivityTaskList from "../components/taskActivities/activityTaskList"
import ChangePassword from '../components/profiles/changePassword';



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
        <Route path="/stages" element={<Stages stages={[]} />} />
        <Route path="/deals" element={<Deals />} />
        <Route
          path="/deal"
          element={
            <AuthProvider>
              <DealDetails />
            </AuthProvider>
          }
        />
        <Route path="/template" element={<TemplatesList />} />
        <Route path="/contact" element={<ContactsList />} />
        <Route path="/email" element={<EmailConfigurationList />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/campaignDetails" element={<CampaignDetails />} />
        <Route path="/users" element={<UsersList />}/>
        <Route path="/Persons" element={<PersonList />}/>
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/reporting" element={<ReportingDashboard />}/>
        <Route path="/enquiries" element={<EnquiryFormList />}/>

        <Route path="/clinic" element={<ClinicList />}/>
        <Route path="/source" element={<SourceList />}/>
        <Route path="/treatment" element={<TreatMentList />}/>

        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/activities" element={ <AuthProvider><ActivityTaskList /></AuthProvider>} />
 
      </Routes>
      <ToastContainer />
    </>
  );
};
