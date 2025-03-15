import React from "react";
import { Layout, Breadcrumb } from "antd";
const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header style={{ background: "#fff", color: "#fff", padding: 0 }}>
      <div style={{ fontSize: "18px" }}>
        {/* <Breadcrumb style={{ color: "#fff", fontSize: "14px" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Current Page</Breadcrumb.Item>
        </Breadcrumb> */}
        <div>Your Header Content Here</div>
      </div>
    </Header>
  );
};

export default CustomHeader;
