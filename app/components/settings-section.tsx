
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Bell, Mail, Shield, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "./ui/use-toast";

export function SettingsSection({ className }: { className?: string }) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <Card className={cn("backdrop-blur-lg bg-card/80 border-primary/10 shadow-lg transition-all hover:shadow-xl", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-extrabold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Settings & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="account-privacy" className="text-base">Account Privacy</Label>
            </div>
            <Switch id="account-privacy" checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
            </div>
            <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
            </div>
            <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
        </div>

        <Separator />
        
          



        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Security Settings</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">Change Password</Button>
            <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
            <Button variant="outline" className="w-full justify-start">Manage Connected Accounts</Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="font-bold hover:scale-105 transition-transform">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>


  );
}
