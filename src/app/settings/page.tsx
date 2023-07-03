"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import SessionRedirect from "@/components/session/session-redirect.component";
import SettingsComponent from "@/components/settings.component";

export default function Settings() {
  const pageName = "Settings";

  return (
    <div>
      <div className="app">
        <SessionRedirect statusToRedirectOn="unauthenticated" pageToRedirectTo="/login"/>
        <Content title={pageName} component={<SettingsComponent />} />
      </div>
    </div>
  );
}
