import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';


function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.authentication.user);
    console.log(user)
    return user ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
