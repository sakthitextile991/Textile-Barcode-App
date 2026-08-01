import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // User is not logged in
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Logged-in user is not an admin
    if (user.role !== "ADMIN") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // Admin can access the route
    return <Outlet />;
};

export default AdminRoute;