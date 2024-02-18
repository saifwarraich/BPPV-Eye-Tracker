import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
        font-family: "Roboto", system-ui, Avenir, Helvetica, Arial, sans-serif;
        min-height: 100vh;
        line-height: 1.5;
        background: rgb(245,227,230);
        background: linear-gradient(124deg, rgba(245,227,230,1) 0%, rgba(217,228,245,1) 100%, rgba(255,196,221,1) 100%);        
    }
`;
export default GlobalStyle;
