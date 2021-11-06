import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "./context/ThemeContext";

export default function AppWrapper() {
  return (
    <AuthProvider>
        <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </AuthProvider>
  );
}
