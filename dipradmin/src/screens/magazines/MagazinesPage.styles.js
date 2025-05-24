import styled from "styled-components";
export const MagazineWrapper = styled.div`
  padding: 20px;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .block-title {
    font-size: 20px;
    font-weight: bold;
  }

  .add-article-btn {
    background-color: #1890ff;
    border-color: #1890ff;
    color: white;
  }

  .add-article-btn:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;
