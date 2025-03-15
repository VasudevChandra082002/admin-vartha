import React from "react";
import { ModerationWrapper } from "./Moderation.Styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ModerationTable from "../../components/moderation/ModerationTable";

function ModerationPage() {
  return (
    <ModerationWrapper>
      <div className="header-section">
        <div className="block-title">Moderation</div>
      </div>
      <div classname="block-table">
        <ModerationTable />
      </div>
    </ModerationWrapper>
  );
}

export default ModerationPage;
