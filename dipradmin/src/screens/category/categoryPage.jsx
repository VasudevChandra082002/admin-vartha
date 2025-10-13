
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CategoryWrapper } from "../category/categoryPage.style";
import CategoryTable from "./CategoryTable";

function CategoryPage() {
  const navigate = useNavigate();

  const handleAddBannerClick = () => {
    navigate("/category/add"); // Navigate to the new banner creation page
  };

  return (
    <CategoryWrapper>
      <div className="header-section">
        <div className="block-title">Category</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddBannerClick}
        >
          Add Category
        </Button>
      </div>

      {/* Banners Table */}
      <div className="block-Table">
        <CategoryTable />
      </div>
    </CategoryWrapper>
  );
}

export default CategoryPage;