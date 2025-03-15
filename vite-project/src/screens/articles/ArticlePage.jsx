import React from "react";
import { ArticlePageWrapper } from "./ArticlePage.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ArticleTable from "../../components/articles/ArticleTable";

function ArticlePage() {
  const navigate = useNavigate();

  const handleAddArticleClick = () => {
    navigate("/add-article");
  };

  return (
    <ArticlePageWrapper>
      <div className="header-section">
        <div className="block-title">Manage Articles</div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddArticleClick}
        >
          Add Article
        </Button>
      </div>

      <div className="block-table">
        <ArticleTable />
      </div>
    </ArticlePageWrapper>
  );
}

export default ArticlePage;
