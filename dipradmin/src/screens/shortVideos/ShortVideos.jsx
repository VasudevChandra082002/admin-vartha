import React from "react";
import { ShortVideosWrapper } from "./ShortVideos.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ShortVideosTable from "../../components/shortVideos/ShortVideosTable";

function ShortVideosPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-ShortVideos");
  };
  return (
    <ShortVideosWrapper>
      <div className="header-section">
        <div className="block-title">Short Videos</div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddClick}
        >
          Add Short Video
        </Button>
      </div>
      <div className="block-table">
        <ShortVideosTable />
      </div>
    </ShortVideosWrapper>
  );
}

export default ShortVideosPage;
