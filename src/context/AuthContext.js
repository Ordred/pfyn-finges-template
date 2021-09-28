import React, { useContext, useState, useEffect } from "react";

import { firebase } from "../initFirebase";

// React Context variable
const AuthContext = React.createContext(null);

// Hook to simplify the usage of the context value
export const useAuth = () => useContext(AuthContext);

// Render a context provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        setIsAuthenticated(!!user);

        if (firebase.auth().currentUser) {
          let idTokenResult = await firebase
            .auth()
            .currentUser.getIdTokenResult(true);
          setIsAdmin(!!idTokenResult.claims.admin);
        }
      });

    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
