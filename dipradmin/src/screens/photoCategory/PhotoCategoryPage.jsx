import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PhotoCategoryTable from "./PhotoCategoryTable";
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

function PhotoCategoryPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/photo-category/add");
  };

  return (
    <Wrapper>
      <div className="header-section">
        <div className="block-title">Photo Categories</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddClick}
        >
          Add Photo Category
        </Button>
      </div>

      <div className="block-Table">
        <PhotoCategoryTable />
      </div>
    </Wrapper>
  );
}

export default PhotoCategoryPage;
