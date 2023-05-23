import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNavigation from "@cloudscape-design/components/side-navigation";

export function ServiceNavigation() {
  const location = useLocation();
  let navigate = useNavigate();

  function onFollowHandler(event) {
    if (!event.detail.external) {
      event.preventDefault();
      navigate(event.detail.href);
    }
  }

  return (
    <SideNavigation
      activeHref={location.pathname}
      header={{ href: "/", text: "HCare360 for Brooks" }}
      onFollow={onFollowHandler}
      items={[
        { type: "link", text: "File share", href: "/" },
        { type: "divider" },
        {
          type: "link",
          text: "Brooks",
          href: "https://www.google.com/search?q=brooks",
          external: true,
        },
        {
          type: "link",
          text: "Numantra Tech",
          href: "https://www.numantratech.com/",
          external: true,
        },
      ]}
    />
  );
}
