import { createGlobalStyle } from "styled-components";
import { media } from "../theme/theme";
export const GlobalStyles = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: inherit;
    }

    body{
        font-family: ${(props) => props.theme.typography.fontFamily};
        font-weight: 400;
        font-size: 16px;
        line-height: 1.6;
        background: #rgba(55, 23, 196, 0.3);};
    }

    html {
        scroll-behavior: smooth;
    }

    ul {
        list-style: none;
    }

    img{
        width: 100%;
        display: block;
        max-width: 100%;
    }
    button{
        border: none;
        outline: 0;
        background-color: transparent;
    }
    a{
        color: unset;
        text-decoration: none;
    }

   
   .page-wrapper {
  display: flex;
  flex-direction: row;
 
  height:100vh;

}

/* Sidebar - Fixed to the Left */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px; /* Same as Sidebar width */
  background-color:rgb(255, 255, 255);
  color: white;
}

/* Content Area (Main Content) */
.content-wrapper {
  flex-grow: 1;
 
  display: flex;
  flex-direction: column;
}

.content-area {
  margin: 16px;
  flex-grow: 1;
  overflow-y: auto;
}

    .text{
        color: ${(props) => props.theme.colors.gray700};
    }
`;
