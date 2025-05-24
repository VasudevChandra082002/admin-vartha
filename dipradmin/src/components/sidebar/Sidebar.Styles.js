import styled from "styled-components";
import { media } from "./../../styles/theme/theme";

export const SidebarWrapper = styled.div`
  background: rgba(55, 23, 196, 0.3);
  box-shadow: 0 0.125rem 0.25rem rgba(165, 163, 174, 0.3);
  width: 260px;
  display: flex;
  flex-direction: column;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  transition: all 300ms ease-in-out;

  ${media.xxxl`
    width: 240px;
  `}

  ${media.xxl`
    width: auto;
    padding: 20px 12px;
  `}

  ${media.xl`
    position: fixed; /* Ensures Sidebar stays fixed */
    top: 0;
    left: 0;
    height: 100%; /* Full height */
    width: 260px;
    z-index: 100; /* Ensure it stays above content */
  `}

  .sidebar-top {
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sidebar-bottom {
    flex: 1;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 12px;
  }

  .brand-logo {
    background: ${(props) => props.theme.colors.blue};
    border-radius: 8px;
    width: 50px;
    height: 40px;
    display: flex;
    place-content: center;
    img {
      width: 44px;
    }
  }

  .brand-text {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.cadet};

    ${media.xxl`
    display:none;`}

    ${media.xl`
        display:inline;`}

    .sidebar-close-btn {
      color: ${(props) => props.theme.colors.gray700};
      display: none;
      cursor: pointer;

      ${media.xl`
        display:inline-flex;`}
    }
  }
  .menu-list {
    display: grid;
    row-gap: 6px;
  }

  .menu-item {
    list-style: none; // Ensures no bullets
  }

  .menu-link {
    height: 44px;
    display: flex;
    align-items: center;
    column-gap: 14px;
    padding: 2px 20px;
    font-weight: 500;
    border-radius: 8px;
    transition: background 0.3s, box-shadow 0.3s;

    ${media.xxl`
    padding: 2px 10px;
  `}

    .menu-link-icon {
      width: 20px;
      ${media.xxl`
      width: 24px;
    `}
      ${media.xl`
      width: 20px;
    `}
    }

    .menu-link-text {
      color: ${(props) => props.theme.colors.gray700};

      ${media.xxl`
      display: none;
    `}
      ${media.xl`
      display: inline;
    `}
    }

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    &.active {
      background: ${(props) => props.theme.colors.blue};
      border-radius: 8px;
      box-shadow: 0 0.125rem 0.25rem rgba(165, 163, 174, 0.3);

      .menu-link-icon {
        filter: invert(1) brightness(100);
      }

      .menu-link-text {
        font-weight: 600;
        color: ${(props) => props.theme.colors.white};
      }
    }
  }
`;
