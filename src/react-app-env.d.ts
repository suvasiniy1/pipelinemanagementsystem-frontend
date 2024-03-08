/// <reference types="react-scripts" />
declare global {
    interface Window {
        config: {
            ServicesBaseURL: string;
            DefaultStages:Array<string>;
        }
    }
}

export {};