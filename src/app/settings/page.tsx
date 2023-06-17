"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import SettingsComponent from "@/components/settings.component";

export default function Settings() {
  const pageName = "Settings";

  return (
    <div>
      <div className="app">
        <Content title={pageName} component={<SettingsComponent />} />
      </div>
    </div>
  );
}
