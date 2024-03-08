import {
    Route,
    Routes
} from "react-router-dom";
import { Leads } from "../components/leads/leads";
import Login from "../components/login";
import { Deals } from "../components/pipeline/deal/deals";
import Stages from "../components/pipeline/stages/stages";

export const AppRouter = () => {
    return (
            <Routes>
                <Route
                    path="/pipeline"
                    element={<Deals />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/pipeline/edit"
                    element={<Stages stages={[]} />}
                />
                <Route
                    path="/pipeline/add"
                    element={<Stages stages={[]} />}
                />
                <Route
                    path="/leads"
                    element={<Leads />}
                />
                <Route
                path="/deals"
                element={<Deals/>}
            />
            </Routes>
    )
}