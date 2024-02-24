import React from "react";
import "./header.css";
import { LetterAvatar } from "../other/avatar";
import { SearchBar } from "./searchBar";

export const HeaderComponent = () => {
    return (
        <div className="form-group row">
            <div className="col-sm-4">
                            
            </div>
            <div className="col-sm-4">
                <SearchBar />
            </div>
            <div className="col-sm-4">
                <LetterAvatar />
            </div>


        </div>
    );
}
