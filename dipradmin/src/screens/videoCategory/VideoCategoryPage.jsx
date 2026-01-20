import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import VideoCategoryTable from "./VideoCategoryTable";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .block-title {
    font-size: 20px;
    font-weight: 700;
  }

  .block-Table {
    margin-top: 30px;
  }
`;

function VideoCategoryPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/video-category/add");
  };

  return (
    <Wrapper>
      <div className="header-section">
        <div className="block-title">Video Categories</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddClick}
        >
          Add Video Category
        </Button>
      </div>

      <div className="block-Table">
        <VideoCategoryTable />
      </div>
    </Wrapper>
  );
}

export default VideoCategoryPage;
