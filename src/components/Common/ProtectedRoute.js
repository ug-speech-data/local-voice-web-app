import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Error401Screen from "../../screens/ErrorScreens/401";


function ProtectedRoute({ children, permissions = [] }) {
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = permissions.every((permission) => userPermissions.has(permission));

    if (!hasPermission)
        return <Error401Screen />
    return user ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
