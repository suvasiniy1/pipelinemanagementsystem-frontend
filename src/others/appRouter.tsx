import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";
import App from "../App";
import { Home } from "../components/home";
import Login from "../components/login";
import { Dashboard } from "../components/dashboard";

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
            </Routes>
        </Router>
    )
}