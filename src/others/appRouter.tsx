import {
    Route,
    Routes
} from "react-router-dom";
import Login from "../components/login";
import { Dashboard } from "../components/pipeline/dashboard";

export const AppRouter = () => {
    return (
            <Routes>
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
            </Routes>
    )
}