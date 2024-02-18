// Define your theme interface
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    white: string;
  };
  fonts: {
    main: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: "#4c83d6",
    secondary: "#fd2d55",
    background:
      "linear-gradient(124deg, rgba(255,201,219,1) 0%, rgba(250,219,231,1) 14%, rgba(255,255,255,1) 68%);",
    text: "#1a1b33",
    white: "#ffffff",
  },
  fonts: {
    main: "Arial, sans-serif",
  },
};
