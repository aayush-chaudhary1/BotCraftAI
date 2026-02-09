import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import { Badge } from './ui/badge';

import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    joinedDate: 'January 2026',
    accountType: 'Free Plan',
  });

  const [editData, setEditData] = useState({ ...userData });

  // Update local state when user context changes
  React.useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || 'User',
        email: user.email || '',
      }));
      setEditData(prev => ({
        ...prev,
        name: user.name || 'User',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-gray-600">Manage your account information and settings</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 text-2xl">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <Badge variant="secondary" className="text-sm">
                {userData.accountType}
              </Badge>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md">{userData.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md">{userData.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md">{userData.joinedDate}</div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authentication
                </Label>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Email &amp; Password</Badge>
                  <span className="text-sm text-gray-600">Sign in using your email and password</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Overview of your account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-1">0</div>
              <div className="text-sm text-gray-600">Chatbots Created</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-1">0</div>
              <div className="text-sm text-gray-600">Documents Uploaded</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-1">0</div>
              <div className="text-sm text-gray-600">Total Conversations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Change Password</div>
              <div className="text-sm text-gray-600">Update your password regularly for security</div>
            </div>
            <Button variant="outline">Change</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
