import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";

export default function AppWrapper() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
  );
}
