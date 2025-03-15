import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Image, Space } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getBanners, deleteBanner } from "../../service/Banner/BannersService"; // Import the functions
import { useNavigate } from "react-router-dom";

function BannersTable() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch banners when the component mounts
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      console.log(response); // Log the API response for debugging

      // Check if response contains data and update state
      if (response && Array.isArray(response)) {
        setBanners(response); // Assuming response is directly the array of banners
      } else {
        message.error("Failed to load banners");
      }
    } catch (error) {
      message.error("Error fetching banners");
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      // Make the delete API call
      const response = await deleteBanner(id);

      // If the response message is "Banner deleted successfully"
      if (response && response.message === "Banner deleted successfully") {
        message.success("Banner deleted successfully!");

        // Update the banners state to remove the deleted banner
        setBanners(banners.filter((banner) => banner._id !== id));
      } else {
        message.error("Failed to delete banner");
      }
    } catch (error) {
      message.error("Error deleting banner");
      console.error("Error deleting banner:", error);
    }
  };

  const handleView = (bannerId) => {
    navigate(`/view-banner/${bannerId}`); // Navigate to the view page for the banner
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "bannerImage",
      key: "bannerImage",
      render: (text) => <Image width={100} src={text} alt="Banner" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "No title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "No description",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(record._id)}
          />
          <Popconfirm
            title="Are you sure to delete this banner?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }} // You can adjust the number of items per page
      />
    </div>
  );
}

export default BannersTable;
