import React from "react";
import { DashboardWrapper } from "./DashboardPage.styles";
import StatsCard from "../../components/dashboard/statsCard/StatsCard";
import DailyUserCard from "../../components/dailyUserCard/dailyUserCard";
import KeyStats from "../../components/keyStats/keyStats";

function DashboardPage() {
  return (
    <DashboardWrapper>
      <div className="block-title">Dashboard</div>
      <div className="stats-card">
        <StatsCard />
      </div>
      <div className="key-stats">
        <KeyStats />
      </div>
      <div className="daily-user">
        <DailyUserCard />
      </div>
    </DashboardWrapper>
  );
}

export default DashboardPage;
