import React from "react";
import "./header.css";
import { LetterAvatar } from "../other/avatar";
import { SearchBar } from "./searchBar";

export const HeaderComponent = () => {
    return (
        <header id="header" className="header pt-2 pb-2">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-sm-4 colheadname">
                        <h1 className="headname">Deals</h1>
                    </div>
                    <div className="col-sm-4 colheadsearch">
                        <SearchBar />
                    </div>
                    <div className="col-sm-4 colheadprofile">
                        <div className="colheadprofilerow">
                        <LetterAvatar />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

