"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
};

const mockSettings: UserSetting[] = [
  { label: "Username", value: "john_doe", type: "text" },
  { label: "Email", value: "john.doe@example.com", type: "text" },
  { label: "Notification", value: true, type: "toggle" },
  { label: "Dark Mode", value: false, type: "toggle" },
  { label: "Language", value: "English", type: "text" },
];

const Settings = () => {
  const [userSettings, setUserSettings] = useState(mockSettings);

  const handleToggleChange = (index: number) => {
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = !settingsCopy[index].value as boolean;
    setUserSettings(settingsCopy);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <div className="bg-[#B10F56] p-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div> */}
      
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#B10F56]">User Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userSettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <label className="text-gray-700 font-medium">{setting.label}</label>
                  <div>
                    {setting.type === "toggle" ? (
                      <Switch
                        checked={setting.value as boolean}
                        onCheckedChange={() => handleToggleChange(index)}
                        className="data-[state=checked]:bg-[#B10F56]"
                      />
                    ) : (
                      <Input
                        type="text"
                        value={setting.value as string}
                        onChange={(e) => {
                          const settingsCopy = [...userSettings];
                          settingsCopy[index].value = e.target.value;
                          setUserSettings(settingsCopy);
                        }}
                        className="w-64 border-gray-200 focus:border-[#B10F56] focus:ring-[#B10F56]"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;