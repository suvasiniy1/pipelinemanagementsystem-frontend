window.config = {
   //ServicesBaseURL: "https://localhost:7182/api",
 ServicesBaseURL: "https://www.y1crm.com/PLMSDev/api",
  SMSServiceURL:"http://localhost:5127/send-sms",
  DefaultStages: [
    "Qualified",
    "Conact Made",
    "Demo Scheduled",
    "Proposal Made",
    "Negotiations Started",
  ],
  HomePage:"/PLMSUI",
  RedirectUri:"http://localhost:3000",
  UseMockService: false,
  CampaignSections: ["Assets", "Tasks"],
  ClientId: "58f8d840-1215-4e4f-8901-da06f1dba5ac",
  DateFormat: "MM/DD/YYYY",
  FrontendBaseURL: "http://localhost:3000/PLMSUI",
  NavItemsForUser: [
    {
      Role: 1,
      NavItems: [
        "Stages",
          "deal",
          "pipeline",
          "pipeline/edit",
          "Activities",
          "Person",
          "Template",
          "Contact",
          "Email",
          "Campaigns",
          "users",
          "Admin",
          "Reporting",
          "Enquiries",
          "Login",
          "Home",
          "confirm-email",
          "Clinic",
          "Source",
          "Treatment",
          "profile",
          "PipeLineType",
      ],
    },
    {
      Role: 2,
      NavItems: [
        "Stages",
        "deal",
    "pipeline",
    "pipeline/edit",
    "Activities",
    "profile",
    "Email",   
      ],
    },
    {
      Role: 3,
      NavItems: [
        "Stages",
        "deal",
        "pipeline",
        "Reporting",
        "Enquiries"
      ],
    },
  ],
  NavItemActiveColor: "#0098e5"
};

   
  

