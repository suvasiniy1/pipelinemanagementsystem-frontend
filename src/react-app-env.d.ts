/// <reference types="react-scripts" />
declare global {
    interface Window {
        AppConfig: {
            ServicesBaseURL: string;
        }
    }
}

export {};