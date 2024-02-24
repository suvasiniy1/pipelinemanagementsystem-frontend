import {
    Route,
    Routes
} from "react-router-dom";
import Login from "../components/login";
import { Dashboard } from "../components/pipeline/dashboard";
import Stages from "../components/pipeline/stages/stages";

export const AppRouter = () => {
    return (
            <Routes>
                <Route
                    path="/pipeline"
                    element={<Dashboard />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/pipeline/edit"
                    element={<Stages stages={[]} />}
                />
            </Routes>
    )
}