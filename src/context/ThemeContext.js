import React, {useContext, useState} from "react";

const DEFAULT_THEME = 'light';

// Yes, this could use a few more attributes to "classify" the different color scheme, typically to use with elements
// taking a boolean to decide on which color scheme to apply. This is sufficient for now.
export const THEME_COLORS = {
    light: {
        foreground: 'inherit',
        background: 'inherit'
    },
    dark: {
        foreground: "#ffffff",
        background: "#0f0f0f"
    }
}

const ThemeContext = React.createContext(DEFAULT_THEME);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
    let [theme, setTheme] = useState(DEFAULT_THEME);

    return <ThemeContext.Provider value={{theme, switchTheme: setTheme}}>{children}</ThemeContext.Provider>;
};