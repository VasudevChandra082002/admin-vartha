import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DistrictsTable from "./DistrictsTable";
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

function DistrictsPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/districts/add");
  };

  return (
    <Wrapper>
      <div className="header-section">
        <div className="block-title">Districts</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddClick}
        >
          Add District
        </Button>
      </div>

      <div className="block-Table">
        <DistrictsTable />
      </div>
    </Wrapper>
  );
}

export default DistrictsPage;
