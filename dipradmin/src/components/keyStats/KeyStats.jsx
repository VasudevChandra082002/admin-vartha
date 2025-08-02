import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import {
  getSessionTime,
  getTotalVisitors,
} from "../../service/statsService/statsService";

function KeyStats() {
  const [stats, setStats] = useState({
    totalAverageTime: 0,
    totalVisitors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch both session time and total visitors data
        const [sessionTimeData, totalVisitorsData] = await Promise.all([
          getSessionTime(),
          getTotalVisitors(),
        ]);

        // Update state with both session time and total visitors
        setStats({
          totalAverageTime: sessionTimeData.averageTime || 0,
          totalVisitors: totalVisitorsData.totalVisits || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    {
      title: "Average Time Spent",
      icon: <UserOutlined style={{ fontSize: "36px", color: "#1890ff" }} />,
      content: stats.totalAverageTime,
    },
    {
      title: "Total Visitors on Web",
      icon: <FileTextOutlined style={{ fontSize: "36px", color: "#1890ff" }} />,
      content: stats.totalVisitors,
    },
  ];

  return (
    <Row gutter={24} style={{ marginTop: "20px" }}>
      {cardData.map((item, index) => (
        <Col key={index} span={6}>
          <Card
          className="hover-card"
            bordered={false}
            style={{
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div>{item.icon}</div>
            <h2
              style={{
                marginTop: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </h2>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "600",
                marginTop: "10px",
                color: "#333",
              }}
            >
              {item.content}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default KeyStats;
