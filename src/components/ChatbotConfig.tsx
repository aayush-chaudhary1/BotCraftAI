import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Bot, ArrowRight, Settings, Palette, Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

export default function ChatbotConfig() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    name: '',
    greeting: "Hi! I'm here to help. Ask me anything.",
    fallback: "I'm sorry, I don't have enough information to answer that. Please try rephrasing your question or contact our support team.",
    responseLength: 'medium',
    tone: 'professional',
    // Widget Appearance Settings
    primaryColor: '#3B82F6',
    accentColor: '#10B981',
    theme: 'light',
    avatar: '🤖',
    widgetName: 'Chat Support',
    welcomeMessage: 'Welcome! How can we help you today?',
    placeholderText: 'Type your message...',
    position: 'bottom-right',
    showBranding: true,
    bubbleStyle: 'rounded',
  });

  useEffect(() => {
    if (!id) {
      toast.error('Please select a chatbot');
      navigate('/dashboard');
      return;
    }
    loadConfig();
  }, [id, navigate]);

  const loadConfig = async () => {
    try {
      const { data, ok } = await api<any>(`/api/chatbots/${id}`);
      if (ok && data) {
        setConfig(prev => ({
          ...prev,
          name: data.name || '',
          ...(data.config || {}),
        }));
      }
    } catch (err) {
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      const { name, ...rest } = config;
      const { ok } = await api(`/api/chatbots/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          config: rest,
        }),
      });

      if (ok) {
        toast.success('Configuration saved');
        navigate(`/preview/${id}`);
        // Refresh active chatbot if needed, but not critical
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  // Avatar options
  const avatarOptions = ['🤖', '👨‍💼', '👩‍💼', '💬', '🎯', '⭐', '🚀', '💡'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      {/* Left Side - Settings */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Chatbot Configuration</h1>
          <p className="text-gray-600">
            Customize your chatbot's behavior and appearance.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Basic Settings</CardTitle>
              </div>
              <CardDescription>
                Configure the fundamental behavior of your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Chatbot Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting Message</Label>
                <Textarea
                  id="greeting"
                  value={config.greeting}
                  onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                  rows={3}
                  placeholder="Hi! I'm here to help. Ask me anything."
                />
                <p className="text-sm text-gray-500">
                  This message will be shown when users start a conversation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback">Fallback Message</Label>
                <Textarea
                  id="fallback"
                  value={config.fallback}
                  onChange={(e) => setConfig({ ...config, fallback: e.target.value })}
                  rows={4}
                  placeholder="I'm sorry, I don't have enough information to answer that."
                />
                <p className="text-sm text-gray-500">
                  Shown when the chatbot cannot answer a question
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Response Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Response Settings</CardTitle>
              </div>
              <CardDescription>
                Control how your chatbot generates responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="responseLength">Response Length</Label>
                <Select
                  value={config.responseLength}
                  onValueChange={(value) => setConfig({ ...config, responseLength: value })}
                >
                  <SelectTrigger id="responseLength">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short - Concise answers (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium - Balanced responses (2-4 sentences)</SelectItem>
                    <SelectItem value="long">Long - Detailed explanations (4+ sentences)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={config.tone}
                  onValueChange={(value) => setConfig({ ...config, tone: value })}
                >
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional - Formal and business-like</SelectItem>
                    <SelectItem value="friendly">Friendly - Warm and approachable</SelectItem>
                    <SelectItem value="casual">Casual - Relaxed and conversational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Widget Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Palette className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Widget Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how your chatbot widget looks and behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Widget Name & Avatar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="widgetName">Widget Name</Label>
                  <Input
                    id="widgetName"
                    value={config.widgetName}
                    onChange={(e) => setConfig({ ...config, widgetName: e.target.value })}
                    placeholder="Chat Support"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex gap-2 flex-wrap">
                    {avatarOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setConfig({ ...config, avatar: emoji })}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${config.avatar === emoji
                          ? 'border-blue-500 bg-blue-50 scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Welcome Message & Placeholder */}
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                  placeholder="Welcome! How can we help you today?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeholderText">Placeholder Text</Label>
                <Input
                  id="placeholderText"
                  value={config.placeholderText}
                  onChange={(e) => setConfig({ ...config, placeholderText: e.target.value })}
                  placeholder="Type your message..."
                />
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="h-10 w-16 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="h-10 w-16 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Widget Theme</Label>
                  <p className="text-sm text-gray-500">
                    Choose between light and dark theme
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Light</span>
                  <Switch
                    id="theme"
                    checked={config.theme === 'dark'}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, theme: checked ? 'dark' : 'light' })
                    }
                  />
                  <span className="text-sm text-gray-600">Dark</span>
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Widget Position</Label>
                <Select
                  value={config.position}
                  onValueChange={(value) => setConfig({ ...config, position: value })}
                >
                  <SelectTrigger id="position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bubble Style */}
              <div className="space-y-2">
                <Label htmlFor="bubbleStyle">Chat Bubble Style</Label>
                <Select
                  value={config.bubbleStyle}
                  onValueChange={(value) => setConfig({ ...config, bubbleStyle: value })}
                >
                  <SelectTrigger id="bubbleStyle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Rounded - Soft, friendly appearance</SelectItem>
                    <SelectItem value="minimal">Minimal - Clean, modern look</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show Branding */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="branding">Show Branding</Label>
                  <p className="text-sm text-gray-500">
                    Display "Powered by" text in widget
                  </p>
                </div>
                <Switch
                  id="branding"
                  checked={config.showBranding}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, showBranding: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-4 pb-6">
            <Button type="button" variant="outline" onClick={() => navigate(`/knowledge-base/${id}`)}>
              Back
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save & Preview
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Right Side - Live Preview */}
      <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
        <div>
          <h2 className="text-2xl mb-2">Live Preview</h2>
          <p className="text-gray-600">
            See how your chatbot will appear to users
          </p>
        </div>

        {/* Preview Container */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 p-8 min-h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-lg">
            Your Website
          </div>

          {/* Chat Widget Button */}
          <div
            className={`absolute bottom-6 ${config.position === 'bottom-right' ? 'right-6' : 'left-6'
              } transition-all duration-300`}
          >
            <div className="flex flex-col items-end gap-3">
              {/* Chat Window */}
              <div
                className={`w-80 shadow-2xl overflow-hidden transition-all ${config.bubbleStyle === 'rounded' ? 'rounded-2xl' : 'rounded-lg'
                  } ${config.theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900'
                  }`}
              >
                {/* Header */}
                <div
                  className="p-4 flex items-center justify-between"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{config.avatar}</div>
                    <div>
                      <h3 className="text-white font-semibold">{config.widgetName}</h3>
                      <p className="text-white/80 text-xs">Online</p>
                    </div>
                  </div>
                  <button className="text-white hover:bg-white/20 p-1 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className={`p-4 space-y-3 h-64 overflow-y-auto ${config.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                  {/* Bot Welcome */}
                  <div className="flex items-start gap-2">
                    <div className="text-lg">{config.avatar}</div>
                    <div
                      className={`px-3 py-2 max-w-[80%] ${config.bubbleStyle === 'rounded' ? 'rounded-2xl' : 'rounded-lg'
                        } ${config.theme === 'dark'
                          ? 'bg-gray-800 text-gray-100'
                          : 'bg-white text-gray-900'
                        }`}
                    >
                      <p className="text-sm">{config.welcomeMessage}</p>
                    </div>
                  </div>

                  {/* Bot Greeting */}
                  <div className="flex items-start gap-2">
                    <div className="text-lg">{config.avatar}</div>
                    <div
                      className={`px-3 py-2 max-w-[80%] ${config.bubbleStyle === 'rounded' ? 'rounded-2xl' : 'rounded-lg'
                        } ${config.theme === 'dark'
                          ? 'bg-gray-800 text-gray-100'
                          : 'bg-white text-gray-900'
                        }`}
                    >
                      <p className="text-sm">{config.greeting}</p>
                    </div>
                  </div>

                  {/* Sample User Message */}
                  <div className="flex items-end gap-2 justify-end">
                    <div
                      className={`px-3 py-2 max-w-[80%] ${config.bubbleStyle === 'rounded' ? 'rounded-2xl' : 'rounded-lg'
                        } text-white`}
                      style={{ backgroundColor: config.accentColor }}
                    >
                      <p className="text-sm">How does this work?</p>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className={`p-3 border-t ${config.theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
                  }`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={config.placeholderText}
                      className={`flex-1 px-3 py-2 ${config.bubbleStyle === 'rounded' ? 'rounded-full' : 'rounded-lg'
                        } outline-none text-sm ${config.theme === 'dark'
                          ? 'bg-gray-700 text-white placeholder-gray-400'
                          : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                        }`}
                      disabled
                    />
                    <button
                      className={`p-2 ${config.bubbleStyle === 'rounded' ? 'rounded-full' : 'rounded-lg'
                        } text-white transition-colors`}
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Branding */}
                {config.showBranding && (
                  <div className={`px-4 py-2 text-center border-t ${config.theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <p className={`text-xs ${config.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      Powered by BotCraft AI
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Bubble Button */}
              <button
                className={`p-4 text-white shadow-lg transition-all hover:scale-110 ${config.bubbleStyle === 'rounded' ? 'rounded-full' : 'rounded-xl'
                  }`}
                style={{ backgroundColor: config.primaryColor }}
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}