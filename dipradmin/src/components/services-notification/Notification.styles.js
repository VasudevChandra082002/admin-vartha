import styled from "styled-components";
import { theme } from "../../styles/theme/theme";

export const NotificationWrapper = styled.div`
  padding: 24px;
  background: ${theme.colors.seasalt};
  min-height: 100vh;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px;
    background: ${theme.colors.white};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    h2 {
      margin: 0;
      color: ${theme.colors.cadet};
      font-family: ${theme.typography.fontFamily};
    }
  }

  .search-section {
    margin-bottom: 24px;
    padding: 20px;
    background: ${theme.colors.white};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .table-section {
    padding: 20px;
    background: ${theme.colors.white};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 16px;

    .header-section {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
  }
`;

