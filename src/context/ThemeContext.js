import React, {useContext} from "react";

const DEFAULT_THEME = 'light';
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
    let theme = DEFAULT_THEME;
    const switchTheme = (newTheme) => theme = newTheme;

    return <ThemeContext.Provider value={{theme, switchTheme}}>{children}</ThemeContext.Provider>;
};