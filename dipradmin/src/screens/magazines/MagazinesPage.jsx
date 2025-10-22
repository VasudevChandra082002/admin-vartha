import React from "react";
import { MagazineWrapper } from "./MagazinesPage.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MagazineTable from "../../components/magazines/MagazineTable";
import MagazineTable2 from "../../components/magazines/MagazineTable2";

/**
 * Page to list and add Magazines
 * 
 * This page displays a table of all Magazines and a button to add a new Magazine.
 * The table is a custom component and is responsible for displaying the data and
 * providing functionality to delete a Magazine.
 * 
 * @return {ReactElement} The Magazines page
 */
function MagazinesPage() {
  const navigate = useNavigate();

  const handleAddArticleClick = () => {
    navigate("/add-Magazine2");
  };

  return (
    <MagazineWrapper>
      <div className="header-section">
        <div className="block-title">March of karnataka</div>
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
        <MagazineTable />
      </div>
    </MagazineWrapper>
  );
}

export default MagazinesPage;
