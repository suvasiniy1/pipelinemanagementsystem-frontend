window.config = {

//  ServicesBaseURL: "http://localhost:5127/api",
  ServicesBaseURL: "https://www.y1crm.com/PLMS/api",
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
        "stages",
          "deal",
          "pipeline",
          "pipeline/edit",
          "activities",
          "persons",
          "template",
          "contact",
          "email",
          "campaigns",
          "users",
          "admin",
          "reporting",
          "enquiries",
          "login",
          "home",
          "confirm-email",
          "clinic",
          "source",
          "treatment",
          "profile"
      ],
    },
    {
      Role: 2,
      NavItems: [
        "stages",
        "deal",
        "pipeline",
        "activities",
        "profile"
      ],
    },
    {
      Role: 3,
      NavItems: [
        "stages",
        "deal",
        "pipeline",
        "reporting",
        "enquiries"
      ],
    },
  ],
  NavItemActiveColor: "#0098e5"
};

   
  

