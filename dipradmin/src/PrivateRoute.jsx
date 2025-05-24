import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Importing js-cookie to access cookies

const PrivateRoute = ({ children }) => {
  const role = Cookies.get("role"); // Get the role from cookies

  // If no role is found, redirect to login (logged-out user trying to access protected routes)
  if (!role) {
    return <Navigate to="/login" />;
  }

  // If role exists, render the protected component (children)
  return children;
};

const PublicRoute = ({ children }) => {
  const role = Cookies.get("role"); // Get the role from cookies

  // If the user is logged in, redirect them away from the login page to the dashboard
  if (role) {
    return <Navigate to="/dashboard" />;
  }

  // If not logged in, render the login page (children)
  return children;
};

export { PrivateRoute, PublicRoute };
