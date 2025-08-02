// import React from "react";
// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie"; // Importing js-cookie to access cookies

// const PrivateRoute = ({ children, allowedRoles =["admin","moderator"]}) => {
//    const token = localStorage.getItem("token");
//   const role = Cookies.get("role"); // Get the role from cookies

//   // If no role is found, redirect to login (logged-out user trying to access protected routes)
//   if (!token || !allowedRoles.includes(role)) {
//     return <Navigate to="/login" replace />;
//   }
//   // If role exists, render the protected component `(children)
//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const role = Cookies.get("role"); // Get the role from cookies

//   // If the user is logged in, redirect them away from the login page to the dashboard
//   if (role) {
//     return <Navigate to="/dashboard" />;
//   }

//   // If not logged in, render the login page (children)
//   return children;
// };

// export { PrivateRoute, PublicRoute };

import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};



// import React from "react";
// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const PrivateRoute = ({ children }) => {
//   const role = Cookies.get("role");

//   if (!role) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const role = Cookies.get("role");

//   // Only redirect "user" role to /dashboard
//   if (role === "content") {
//     return <Navigate to="/dashboard" />;
//   }

//   // For admin, moderator, or not logged in, render the original route
//   return children;
// };

// export { PrivateRoute, PublicRoute };
