import React from "react";
import { Card, Col, Row } from "antd";

function UsersCard() {
  return (
    <Row gutter={24} style={{ margin: "16px 0" }}>
      <Col span={6}>
        <Card
          bordered={false}
          style={{
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}
          >
            New Users
          </h2>
        </Card>
      </Col>
    </Row>
  );
}

export default UsersCard;
