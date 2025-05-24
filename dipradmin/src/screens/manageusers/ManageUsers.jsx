import React from "react";
import { ManageUsersWrapper } from "./ManageUsersPage.styles";
import UsersTable from "../../components/users/UsersTable";
import UsersCard from "../../components/users/UsersCard";

function ManageUsers() {
  return (
    <ManageUsersWrapper>
      <div className="block-title">Manage Users</div>
      {/* <div className="users-card">
        <UsersCard />
      </div> */}
      <div className="users-table">
        <UsersTable />
      </div>
    </ManageUsersWrapper>
  );
}

export default ManageUsers;
