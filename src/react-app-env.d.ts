/// <reference types="react-scripts" />
declare global {
    interface Window {
        config: {
            ServicesBaseURL: string;
            DefaultStages:Array<string>;
            UseMockService:boolean;
            CampaignSections:Array<string>;
            ClientId:string;
            DateFormat:string;
            NavItemsForUser:Array<any>;
            RedirectUri:string;
            NavItemActiveColor:string;
        }
    }
}

export {};