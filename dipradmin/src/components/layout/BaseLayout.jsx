import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.jsx";
import Header from "../header/Header.jsx";

const { Sider, Content } = Layout;

const BaseLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={260}
        style={{
          // backgroundColor: "#2c3e50",
           backgroundColor: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0, // Ensure Sider stays fixed on the screen
          // overflowY: "auto", // Allow scrolling in the sidebar if necessary
        }}
      >
        <Sidebar />
      </Sider>

      {/* Main Content Area */}
      <Layout
        style={{
          marginLeft: 260, // Offset content to make space for the sidebar
          minHeight: "100vh", // Ensures the content area takes full height
        }}
      >
        {/* Header */}
        {/* Add your header here if needed */}
        {/* <Header /> */}

        {/* Content */}
        <Content
          style={{
            margin: "16px",
            // overflowY: "auto", // Allow content area to scroll
            padding: 24,
            backgroundColor: "#fff",
            minHeight: "calc(100vh - 64px)", // Adjust for the header height
          }}
        >
          <div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
