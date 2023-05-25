import React, { useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { Amplify, Auth } from "aws-amplify";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { RequireAuth } from "./components/RequireAuth";
import awsconfig from "./aws-exports";
import { ContentAuthWrapper } from "./components/content-auth-wrapper";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
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

export function formatBytes(a, b = 2, k = 1024) {
  let d = Math.floor(Math.log(a) / Math.log(k));
  return 0 === a
    ? "0 Bytes"
    : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
        " " +
        ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
}

function App() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const navbarItemClick = (e) => {
    console.log(e);
    if (e.detail.id === "signout") {
      Auth.signOut().then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route
              path="/cloudshare"
              element={
                <RequireAuth>
                  <ContentAuthWrapper
                    user={{ email: "" }}
                    navbarItemClick={navbarItemClick}
                    navigationOpen={navigationOpen}
                    setNavigationOpen={setNavigationOpen}
                  />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}

export default App;
