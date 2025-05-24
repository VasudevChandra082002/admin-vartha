import React from "react";
import { LongVideoWrapper } from "./Long-Videos.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LongVideosTable from "../../components/longVideo/LongVideoTable";

function LongVideos() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-LongVideo");
  };

  return (
    <LongVideoWrapper>
      <div className="header-section">
        <div className="block-title">Long-video</div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddClick}
        >
          Add Video
        </Button>
      </div>

      <div className="block=table">
        <LongVideosTable />
      </div>
    </LongVideoWrapper>
  );
}

export default LongVideos;
