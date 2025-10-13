import React from "react";
import { MagazineWrapper } from "../magazines/MagazinesPage.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import MagazineTable from "../../components/magazines/MagazineTable";
import MagazineTable2 from "../../components/magazines/MagazineTable2";


function MagazinesPage2() {
  const navigate = useNavigate();

  const handleAddArticleClick = () => {
    navigate("/add-varthajanapada");
  };

  return (
    <MagazineWrapper>
      <div className="header-section">
        <div className="block-title">Vartha janapada</div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddArticleClick}
        >
          Add Magazine
        </Button>
      </div>
      <div className="block-table">
        <MagazineTable2 />
      </div>
    </MagazineWrapper>
  );
}

export default MagazinesPage2;
