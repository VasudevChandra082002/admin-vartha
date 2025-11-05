import styled from "styled-components";
import { theme } from "../../../../styles/theme/theme";

export const UpdateNotificationWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.seasalt};
  padding: 24px;

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px;
  }

  .form-card {
    width: 100%;
    max-width: 520px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    border-radius: 12px;

    .ant-card-body {
      padding: 24px;
    }
  }

  .form-title {
    margin-bottom: 4px;
    color: ${theme.colors.cadet};
    font-family: ${theme.typography.fontFamily};
  }

  .form-subtitle {
    display: block;
    margin-bottom: 20px;
    color: ${theme.colors.gray700};
  }

  .notification-form {
    margin-top: 20px;
  }

  .link-preview-box {
    width: 100%;
    min-height: 80px;
    border: 1px dashed #d9d9d9;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    margin-bottom: 16px;
    background: #fafafa;
  }

  .link-hint {
    font-size: 12px;
    margin-top: 8px;
    color: ${theme.colors.gray700};
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 24px;

    .submit-button {
      background: ${theme.colors.blue};
      border-color: ${theme.colors.blue};

      &:hover {
        background: ${theme.colors.dodgerBlue};
        border-color: ${theme.colors.dodgerBlue};
      }
    }

    .reset-button {
      border-color: ${theme.colors.frenchGray};
      color: ${theme.colors.gray700};

      &:hover {
        border-color: ${theme.colors.blue};
        color: ${theme.colors.blue};
      }
    }

    .cancel-button {
      border-color: ${theme.colors.frenchGray};
      color: ${theme.colors.gray700};

      &:hover {
        border-color: ${theme.colors.red};
        color: ${theme.colors.red};
      }
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 16px;

    .form-card {
      max-width: 100%;
    }
  }
`;

