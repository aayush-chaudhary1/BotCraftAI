import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Code, Copy, CheckCircle, Globe, Rocket } from 'lucide-react';
import { toast } from 'sonner';

export default function Deployment() {
  const navigate = useNavigate();
  const [domains, setDomains] = useState(['example.com', 'app.example.com']);
  const [newDomain, setNewDomain] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const embedCode = `<!-- Chatbot Widget -->
<script>
  window.chatbotConfig = {
    botId: 'demo-bot-123',
    position: 'bottom-right'
  };
</script>
<script src="https://cdn.chatbot.app/widget.js"></script>`;

  const iframeCode = `<iframe
  src="https://chat.example.com/embed/demo-bot-123"
  width="400"
  height="600"
  frameborder="0"
></iframe>`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain('');
      toast.success('Domain added successfully!');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
    toast.success('Domain removed successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Deployment & Embed</h1>
        <p className="text-gray-600">
          Integrate your chatbot into your web app or website.
        </p>
      </div>

      {/* Status Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Rocket className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">Your chatbot is live!</p>
              <p className="text-sm text-green-700">Copy the code below to add it to your web app</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embed Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Embed Options</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to integrate the chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="script">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="script">JavaScript Embed</TabsTrigger>
              <TabsTrigger value="iframe">iFrame Embed</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-4">
              <div>
                <Label className="text-base mb-2 block">JavaScript Widget</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Recommended: Adds a floating chat widget to your website
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {embedCode}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(embedCode, 'script')}
                  >
                    {copied === 'script' ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copied === 'script' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Installation:</strong> Paste this code before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag in your HTML
                </p>
              </div>
            </TabsContent>

            <TabsContent value="iframe" className="space-y-4">
              <div>
                <Label className="text-base mb-2 block">iFrame Embed</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Embed the chat interface directly in a specific area of your page
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {iframeCode}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(iframeCode, 'iframe')}
                  >
                    {copied === 'iframe' ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copied === 'iframe' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Note:</strong> You can customize the width and height attributes to fit your design
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Domain Whitelist */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Domain Whitelist</CardTitle>
          </div>
          <CardDescription>
            Control which domains can embed your chatbot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="yourdomain.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
            />
            <Button onClick={handleAddDomain}>Add Domain</Button>
          </div>

          <div className="space-y-2">
            {domains.map((domain) => (
              <div
                key={domain}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>{domain}</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDomain(domain)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {domains.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No domains whitelisted</p>
              <p className="text-sm">Add domains to control where your chatbot can be embedded</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => navigate('/preview/demo')}>
          Back to Preview
        </Button>
        <Button onClick={() => navigate('/analytics/demo')}>
          View Analytics
        </Button>
      </div>
    </div>
  );
}