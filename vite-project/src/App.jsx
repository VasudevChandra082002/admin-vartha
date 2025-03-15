import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme/theme";
import { GlobalStyles } from "./styles/global/GlobalStyles";

import BaseLayout from "./components/layout/BaseLayout";
import DashboardPage from "./screens/dashboard/DashboardPage";
import ManageUsers from "./screens/manageusers/ManageUsers";
import ArticlePage from "./screens/articles/ArticlePage";
import AddArticlePage from "./screens/articles/AddArticlePage";
import EditArticlesPage from "./screens/articles/EditArticlesPage";
import MagazinesPage from "./screens/magazines/MagazinesPage";
import AddMagazinePage from "./screens/magazines/AddMagazines";
import UpdateMagazinePage from "./screens/magazines/EditMagazine";
import BannersPage from "./screens/banners/BannersPage";
import ShortVideosPage from "./screens/shortVideos/ShortVideos";
import AddVideoPage from "./screens/shortVideos/addShortvideos";
import LongVideos from "./screens/longVideos/Long-Videos";
import AddLongVideos from "./screens/longVideos/AddLongVideos";
import ModerationPage from "./screens/moderation/ModerationPage";
import LoginPage from "./screens/auth/LoginPage";
import { PrivateRoute, PublicRoute } from "./PrivateRoute.jsx"; // Import PrivateRoute and PublicRoute
import Cookies from "js-cookie"; // Import js-cookie for accessing cookies
import Notifications from "./screens/notifications/Notifications.jsx";
import CategoryPage from "./screens/category/categoryPage.jsx";
import MagazinesPage2 from "./screens/magazines2/MagazinesPage2.jsx";
import AddMagazinePage2 from "./screens/magazines2/AddMagazine2.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get the role from cookies
    const storedRole = Cookies.get("role");
    console.log("Stored Role from Cookies:", storedRole); // Log the stored role
    if (storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true); // Set authenticated state based on role
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const storedRole = Cookies.get("role");
    console.log("Role after login:", storedRole); // Log the role after login
    setRole(storedRole);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Login Route wrapped with PublicRoute */}
          <Route
            path="login"
            element={
              <PublicRoute>
                <LoginPage onLogin={handleLogin} />
              </PublicRoute>
            }
          />

          <Route path="/" element={<BaseLayout />}>
            {/* Protected Routes wrapped with PrivateRoute */}
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <PrivateRoute>
                  <ManageUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-articles"
              element={
                <PrivateRoute>
                  <ArticlePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-article"
              element={
                <PrivateRoute>
                  <AddArticlePage />
                </PrivateRoute>
              }
            />{" "}
            <Route
              path="/manage-Notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-magazines1"
              element={
                <PrivateRoute>
                  <MagazinesPage />
                </PrivateRoute>
              }
            />{" "}
            <Route
              path="/manage-magazines2"
              element={
                <PrivateRoute>
                  <MagazinesPage2 />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-banners"
              element={
                <PrivateRoute>
                  <BannersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-magazine"
              element={
                <PrivateRoute>
                  <AddMagazinePage />
                </PrivateRoute>
              }
            />{" "}
            <Route
              path="/add-magazine2"
              element={
                <PrivateRoute>
                  <AddMagazinePage2 />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-shortvideos"
              element={
                <PrivateRoute>
                  <ShortVideosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-shortvideo"
              element={
                <PrivateRoute>
                  <AddVideoPage />
                </PrivateRoute>
              }
            />{" "}
            <Route
              path="/manage-category"
              element={
                <PrivateRoute>
                  <CategoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-longvideo"
              element={
                <PrivateRoute>
                  <LongVideos />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-longvideo"
              element={
                <PrivateRoute>
                  <AddLongVideos />
                </PrivateRoute>
              }
            />{" "}
            <Route
              path="/add-shortVideos"
              element={
                <PrivateRoute>
                  <AddVideoPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-moderation"
              element={
                <PrivateRoute>
                  <ModerationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-article/:articleId"
              element={
                <PrivateRoute>
                  <EditArticlesPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
