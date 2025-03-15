import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import {
  getTotalUsers,
  getTotalArticles,
  getTotalMagazine,
  getTotalVideos,
} from "../../../service/Dashboard/Dashboardapi";

function StatsCard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalMagazines: 0,
    totalVideos: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, articles, magazines, videos] = await Promise.all([
          getTotalUsers(),
          getTotalArticles(),
          getTotalMagazine(),
          getTotalVideos(),
        ]);

        setStats({
          totalUsers: users.totalUsers || 0,
          totalArticles: articles.data || 0,
          totalMagazines: magazines.data || 0,
          totalVideos: videos.data || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    {
      title: "Total Users",
      icon: <UserOutlined style={{ fontSize: "36px", color: "#1890ff" }} />,
      content: stats.totalUsers,
    },
    {
      title: "Total Articles",
      icon: <FileTextOutlined style={{ fontSize: "36px", color: "#52c41a" }} />,
      content: stats.totalArticles,
    },
    {
      title: "Total Magazines",
      icon: <BookOutlined style={{ fontSize: "36px", color: "#faad14" }} />,
      content: stats.totalMagazines,
    },
    {
      title: "Total Videos",
      icon: (
        <VideoCameraOutlined style={{ fontSize: "36px", color: "#eb2f96" }} />
      ),
      content: stats.totalVideos,
    },
  ];

  return (
    <Row gutter={24} style={{ marginTop: "20px" }}>
      {cardData.map((item, index) => (
        <Col key={index} span={6}>
          <Card
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

export default StatsCard;
