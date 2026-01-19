import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { User, Lock, CreditCard, Users, Bot, Database, Bell, Trash2, Save, LogOut, Shield, Download, Upload, Clock, Monitor, Mail, Smartphone, AlertTriangle, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [activeSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Firefox on MacOS', location: 'Los Angeles, US', lastActive: '1 day ago', current: false },
  ]);

  const [teamMembers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', role: 'Viewer', status: 'Pending' },
  ]);

  const [aiDefaults, setAiDefaults] = useState({
    responseLength: 'medium',
    tone: 'professional',
    language: 'en',
  });

  const [notifications, setNotifications] = useState({
    usageLimits: true,
    errors: true,
    updates: false,
    weeklyReports: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleLogoutAllSessions = () => {
    toast.success('Logged out from all other sessions');
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (!twoFactorEnabled) {
      toast.success('Two-factor authentication enabled');
    } else {
      toast.success('Two-factor authentication disabled');
    }
  };

  const handleRevokeSession = (sessionId: number) => {
    toast.success('Session revoked successfully');
  };

  const handleInviteMember = () => {
    toast.success('Invitation sent!');
  };

  const handleRemoveMember = (name: string) => {
    toast.success(`${name} removed from team`);
  };

  const handleSaveAIDefaults = () => {
    toast.success('AI behavior defaults saved');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleDeleteChatbotData = () => {
    toast.success('Chatbot data deleted successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleDeleteAccount = () => {
    toast.success('Account deletion initiated. You will receive a confirmation email.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account, security, billing, and platform preferences.
        </p>
      </div>

      {/* Account Settings */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Account Settings</h2>
          <p className="text-gray-600 text-sm">Manage your personal information and account preferences</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your name and email address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleLogoutAllSessions}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout from All Sessions
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Security Settings */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Security Settings</h2>
          <p className="text-gray-600 text-sm">Manage your password, two-factor authentication, and active sessions</p>
        </div>

        <div className="space-y-4">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                />
              </div>
            </CardHeader>
            {twoFactorEnabled && (
              <CardContent>
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">2FA is enabled</p>
                    <p className="text-sm text-green-700 mt-1">Your account is protected with two-factor authentication</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Monitor className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage devices where you're currently logged in</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{session.device}</p>
                          {session.current && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{session.location}</p>
                        <p className="text-xs text-gray-500 mt-1">Last active: {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Billing & Plan */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Billing & Plan</h2>
          <p className="text-gray-600 text-sm">Manage your subscription and usage</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You're on the Pro plan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Info */}
            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div>
                <p className="font-semibold text-lg">Pro Plan</p>
                <p className="text-sm text-gray-600">$49/month - Renews on Feb 19, 2026</p>
              </div>
              <div className="text-right">
                <Badge className="bg-indigo-600">Active</Badge>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="space-y-4">
              <h3 className="font-semibold">Usage Limits</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Chatbots</span>
                    <span className="font-medium">0 / 10</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Monthly Conversations</span>
                    <span className="font-medium">0 / 10,000</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Document Storage</span>
                    <span className="font-medium">0 MB / 5 GB</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">View Billing History</Button>
              <Button variant="outline">Manage Payment Method</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Team & Access */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Team & Access</h2>
          <p className="text-gray-600 text-sm">Invite team members and manage permissions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>3 members · 2 seats available</CardDescription>
                </div>
              </div>
              <Button onClick={handleInviteMember}>
                <Mail className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select defaultValue={member.role.toLowerCase()}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveMember(member.name)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* AI Behavior Defaults */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">AI Behavior Defaults</h2>
          <p className="text-gray-600 text-sm">Set global defaults for all your chatbots</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Bot className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <CardTitle>Default Behavior Settings</CardTitle>
                <CardDescription>These settings will apply to all new chatbots</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultResponseLength">Response Length</Label>
                <Select
                  value={aiDefaults.responseLength}
                  onValueChange={(value) => setAiDefaults({ ...aiDefaults, responseLength: value })}
                >
                  <SelectTrigger id="defaultResponseLength">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTone">Default Tone</Label>
                <Select
                  value={aiDefaults.tone}
                  onValueChange={(value) => setAiDefaults({ ...aiDefaults, tone: value })}
                >
                  <SelectTrigger id="defaultTone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={aiDefaults.language}
                  onValueChange={(value) => setAiDefaults({ ...aiDefaults, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSaveAIDefaults}>
              <Save className="w-4 h-4 mr-2" />
              Save Defaults
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Data & Privacy */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Data & Privacy</h2>
          <p className="text-gray-600 text-sm">Manage your data, exports, and privacy settings</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export or delete your chatbot data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Export All Data</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Download a complete copy of your chatbots, conversations, and documents
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="retention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Conversation history older than this period will be automatically deleted
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Chatbot Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete all chatbot data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all chatbot conversations and documents. 
                      Your chatbot configurations will be preserved. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteChatbotData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Notifications */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Notifications</h2>
          <p className="text-gray-600 text-sm">Configure email alerts and notifications</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Usage Limit Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when approaching plan limits</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.usageLimits}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, usageLimits: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Error Alerts</p>
                    <p className="text-sm text-gray-600">Receive alerts when chatbot errors occur</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.errors}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, errors: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Product Updates</p>
                    <p className="text-sm text-gray-600">News about new features and improvements</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, updates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Weekly Reports</p>
                    <p className="text-sm text-gray-600">Summary of chatbot performance and usage</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
            </div>

            <Button onClick={handleSaveNotifications}>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Danger Zone */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl mb-1 text-red-900">Danger Zone</h2>
          <p className="text-gray-600 text-sm">Irreversible and destructive actions</p>
        </div>

        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-900">Delete Account</CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white border border-red-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Warning:</strong> This action cannot be undone. This will permanently delete:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Your account and profile information</li>
                <li>All chatbots and their configurations</li>
                <li>All conversation history and analytics</li>
                <li>All uploaded documents and knowledge bases</li>
                <li>Team members and access permissions</li>
              </ul>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers. You will be logged out immediately
                    and will not be able to recover your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
