import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { Amplify, Auth, Hub } from "aws-amplify";
import { Login } from "./components/Login";
import { RequireAuth } from "./components/RequireAuth";
import awsconfig from "./aws-exports";
import { CloudShare } from "./components/cloudshare";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { oauth } from "./saml";

// Setup OAuth for SAML
awsconfig.oauth = oauth;

Amplify.configure(awsconfig);

export const appLayoutLabels = {
  navigation: "Side navigation",
  navigationToggle: "Open side navigation",
  navigationClose: "Close side navigation",
  notifications: "Notifications",
  tools: "Help panel",
  toolsToggle: "Open help panel",
  toolsClose: "Close help panel",
};

function App() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => console.log("Not signed in"));

    return unsubscribe;
  }, []);
  const navbarItemClick = (e) => {
    console.log(e);
    if (e.detail.id === "signout") {
      Auth.signOut()
        .then(() => {
          // window.location.reload();
        })
        .catch((err) => console.log);
    }
  };
  {
    /* <Route path="*" element={<Navigate to="/cloudshare" replace />} />
            <Route index element={<Navigate to="/cloudshare" replace />} /> */
  }
  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              path="/cloudshare"
              element={
                <RequireAuth>
                  <CloudShare
                    user={{ email: "" }}
                    navbarItemClick={navbarItemClick}
                    navigationOpen={navigationOpen}
                    setNavigationOpen={setNavigationOpen}
                  />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/cloudshare" replace />} />
            <Route index element={<Navigate to="/cloudshare" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}
export default App;
